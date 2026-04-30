# devticon-ct-resources

Shared [Cloudticon `ct`](https://github.com/cloudticon/ct) factories for Devticon
projects. Built on top of `cloudticon/k8s-factories` and `cloudticon/k8s` with
Devticon-specific defaults: Istio `default/default` gateway,
`letsencrypt-cf-prod` cert-manager issuer, `prometheus-kube-prometheus`
ServiceMonitor release label.

## Usage

```ts
import {
  // Core
  webApp, expose, postgres, infisicalSecrets,
  // Custom resources (apps.cloudticon.com/v1alpha1)
  app, hasura, projectSecrets,
  // Networking
  customGateway, singleHostRoute,
  // Workloads
  dbMigrationJob,
  // Observability
  prometheusServiceMonitor, grafanaDashboards, otelEnv,
  // Re-exports from k8s-factories
  env, vol,
} from "github.com/devticon/ct@master";
```

## Factories

### Core

| Factory | File | Description |
|---|---|---|
| `webApp`, `expose` | `webapp.ct` | WebApp + Service with Istio defaults, resource presets (`small`/`medium`/`large`), `replicas=2`, `/health` probes. |
| `postgres` | `postgres.ct` | CNPG cluster + `envUrl()` helper for `DATABASE_URL`. Default secret `db`. |
| `infisicalSecrets` | `secrets.ct` | `ProjectSecrets` CR wrapper. Default name `main`. |

### Custom resources

| Factory | File | Description |
|---|---|---|
| `app`, `hasura`, `projectSecrets` | `apps-cloudticon-com/v1alpha1.ts` | CRDs from `apps.cloudticon.com/v1alpha1`. |

### Networking — `gateway.ct`

#### `customGateway({ host, httpsRedirect, issuer?, selector? })`

Istio `Gateway` + cert-manager `Certificate` for projects that need a dedicated
gateway alongside `default/default`.

- `issuer` — `ClusterIssuer` name. Default `letsencrypt-cf-prod` (DNS-01 with Cloudflare).
- `selector` — Gateway pod selector. Default `{ app: "istio-gateway" }`.
- Generates cert in `istio-system` namespace, secret named after host.
- Sync wave `-100` so gateway/cert come up before workloads.

#### `singleHostRoute({ name, host, serviceHost, servicePort, customGateway?, gateways? })`

`VirtualService` routing all `/` traffic to one Service.

- Default gateways: `["default/default"]`. Add `"custom"` via `customGateway: true` flag.
- Override fully with `gateways: ["my-ns/my-gw"]`.

### Workloads — `migration.ct`

#### `dbMigrationJob({ name, image, tag, command, imagePullSecrets?, dbSecret?, env? })`

Job for DB migrations.

- Helm `post-install`/`post-upgrade` hooks have no `ct` equivalent. This factory
  re-runs the migration on image change by suffixing the Job name with the short
  tag (first 12 chars). Old completed Jobs are GC'd by `ttlSecondsAfterFinished`.
- Default `dbSecret` is `{ name: "db", key: "endpoint" }`.
- Default container env injects `DATABASE_URL` from `dbSecret`. Pass `env` to
  override entirely.
- Defaults: `backoffLimit=3`, `activeDeadlineSeconds=120`, `ttlSecondsAfterFinished=300`.

### Observability — `observability.ct`

#### `prometheusServiceMonitor({ name, appLabel, port, path?, interval?, scrapeTimeout?, honorLabels?, release? })`

`ServiceMonitor` CR scraping a Service port.

- `release` defaults to `prometheus-kube-prometheus` — kube-prometheus-stack
  release name on every Devticon cluster.
- Defaults: `path=/metrics`, `interval=30s`, `scrapeTimeout=10s`, `honorLabels=false`.

#### `grafanaDashboards({ app, instanceLabel, dashboards, resyncPeriod?, allowCrossNamespaceImport? })`

Batch-create `GrafanaDashboard` CRs from a list of `{ id, json }` entries.

- `allowCrossNamespaceImport` defaults to `true` because Grafana CR lives in
  `monitoring` while dashboards ship in the project namespace (Grafana Operator
  v5 flipped the default to `false`).
- `resyncPeriod` default `5m`.

#### `otelEnv({ serviceName, endpoint, serviceVersion, deploymentEnv, ... })`

Returns the `OTEL_*` env block as `Record<string, string>`. Spread into
`webApp().env`. Optional fields (`tracesSampler`, `tracesSamplerArg`,
`resourceAttributes`, `grafanaTempoBaseUrl`, `protocol`) are only emitted when
set, so the resulting env stays minimal.

## Example — full project setup

```ts
import {
  customGateway,
  dbMigrationJob,
  env,
  grafanaDashboards,
  infisicalSecrets,
  otelEnv,
  postgres,
  prometheusServiceMonitor,
  singleHostRoute,
  vol,
  webApp,
} from "github.com/devticon/ct@master";

import dashboardJson from "./dashboards/main.json";

const APP = "myapp";
const PORT = 3000;
const fullImage = () => `${Values.image.name}:${Values.image.tag}`;

infisicalSecrets({
  name: "secrets",
  project: Values.projectSecrets.project,
  env: Values.secretEnv,
});

postgres({ name: "postgres", instances: 1 });

webApp({
  name: APP,
  image: fullImage(),
  port: PORT,
  env: {
    DATABASE_URL: env.secret("db", "endpoint"),
    ...otelEnv({
      serviceName: APP,
      endpoint: "http://tempo.monitoring.svc.cluster.local:4317",
      serviceVersion: Values.image.tag,
      deploymentEnv: "production",
    }),
  },
});

singleHostRoute({
  name: APP,
  host: Values.host,
  serviceHost: APP,
  servicePort: 80,
  customGateway: Values.customGateway,
});

if (Values.customGateway) {
  customGateway({ host: Values.host, httpsRedirect: true });
}

dbMigrationJob({
  name: `${APP}-db-migrate`,
  image: fullImage(),
  tag: Values.image.tag,
  command: ["npm", "run", "db:migrate"],
  imagePullSecrets: Values.imagePullSecrets,
});

prometheusServiceMonitor({ name: APP, appLabel: APP, port: "http" });

grafanaDashboards({
  app: APP,
  instanceLabel: "grafana",
  dashboards: [{ id: "main", json: dashboardJson }],
});
```

## Adding a new factory

1. Create `<name>.ct` exporting your factory functions.
2. Re-export from `index.ct`.
3. Commit + push to `master`.
4. In consumer projects, `ct template` re-pulls automatically; for stale
   caches: `rm -rf ~/.ct/cache/github.com/devticon/ct@master` or run with
   `--no-cache`.

### Style guide

- One file per domain concern (e.g. `gateway.ct`, `observability.ct`).
- Factories accept a single options object. Optional fields use `?` and default
  via `??` inside the body.
- Export factory functions as named `const` (or `export function` for the few
  that have generic constraints) — match existing files.
- Add a short JSDoc-style comment above each factory explaining the **why**
  behind defaults, not the what (the type signature already says what).
- Keep factories thin — they should hide one Devticon convention (e.g. "we
  always use `letsencrypt-cf-prod`") rather than re-implement the underlying
  Kubernetes resource.
