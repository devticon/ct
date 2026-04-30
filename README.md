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
  workload, expose, postgres, infisicalSecrets,
  // Custom resources (apps.cloudticon.com/v1alpha1)
  app, hasura, projectSecrets,
  // Networking
  customGateway, singleHostRoute, route,
  // Workloads
  dbMigrationJob,
  // Observability
  prometheusServiceMonitor, grafanaDashboards, otelEnv, observability,
  // Re-exports from k8s-factories
  env, vol,
} from "github.com/devticon/ct@master";
```

## Conventions

- **Every factory accepts `enabled?: boolean`** (default `true`). When `false`,
  the factory emits nothing and returns a stub handle (e.g. `postgres().envUrl()`
  returns `undefined`, `workload().url()` returns `undefined`, `observability().env`
  is `{}`). Lets you skip `if (Values.X.enabled) { ... }` wrapping.
- **`workload({ env })` drops `undefined` and `false` values** before emitting.
  No more `...(Values.foo.enabled && { FOO_URL: ... })` conditional spreads —
  write `FOO_URL: Values.foo.enabled ? "..." : undefined` (or `redis.url("redis")`
  which returns `undefined` when redis is disabled).
- **Bundles over à la carte**: prefer `postgres({ migration })`,
  `observability({ serviceMonitor, dashboards })`, `route({ customGateway })`
  over composing the lower-level factories by hand. The lower-level factories
  remain exported for unusual cases.

## Factories

### Core

| Factory | File | Description |
|---|---|---|
| `workload`, `expose` | `workload.ct` | Deployment + Service for any pod (web app, cache, worker, sidecar). Defaults: Istio, replicas=2, /health, medium resources. Resource presets `small`/`medium`/`large`. `workload(...).url(scheme?)` returns the in-cluster address. |
| `postgres` | `postgres.ct` | CNPG cluster. `secret` defaults to `db`. `postgres(...).envUrl()` returns a `DATABASE_URL` secret-ref. Optional bundled migration via `migration: { ... }`. |
| `infisicalSecrets` | `secrets.ct` | `ProjectSecrets` CR wrapper. Default name `main`. |

> `webApp` is kept as a `@deprecated` alias for `workload` — migrate when you
> next touch `main.ct`. Internally identical.

### Custom resources

| Factory | File | Description |
|---|---|---|
| `app`, `hasura`, `projectSecrets` | `apps-cloudticon-com/v1alpha1.ts` | CRDs from `apps.cloudticon.com/v1alpha1`. |

### Networking — `gateway.ct`

#### `route({ name, host, serviceHost, servicePort, customGateway?, gateways?, enabled? })`

Bundle: `singleHostRoute` + optional dedicated `customGateway`. Pass an object
to `customGateway` (e.g. `{ httpsRedirect: true }`) to spin one up alongside
`default/default`; pass `false` (or omit) to use only `default/default`.

#### `customGateway({ host, httpsRedirect, issuer?, selector?, enabled? })`

Istio `Gateway` + cert-manager `Certificate` for projects that need a dedicated
gateway alongside `default/default`. Used internally by `route()` — call directly
only for advanced cases.

- `issuer` — `ClusterIssuer` name. Default `letsencrypt-cf-prod` (DNS-01 with Cloudflare).
- `selector` — Gateway pod selector. Default `{ app: "istio-gateway" }`.
- Generates cert in `istio-system` namespace, secret named after host.
- Sync wave `-100` so gateway/cert come up before workloads.

#### `singleHostRoute({ name, host, serviceHost, servicePort, customGateway?, gateways?, enabled? })`

`VirtualService` routing all `/` traffic to one Service. Used internally by
`route()`.

- Default gateways: `["default/default"]`. Add `"custom"` via `customGateway: true` flag.
- Override fully with `gateways: ["my-ns/my-gw"]`.

### Workloads — `migration.ct`

#### `dbMigrationJob({ name, image, tag, command, imagePullSecrets?, dbSecret?, env?, enabled? })`

Job for DB migrations. Prefer `postgres({ migration: { ... } })` over calling
this directly — the bundle wires `dbSecret` from the postgres `secret`.

- Helm `post-install`/`post-upgrade` hooks have no `ct` equivalent. This factory
  re-runs the migration on image change by suffixing the Job name with the short
  tag (first 12 chars). Old completed Jobs are GC'd by `ttlSecondsAfterFinished`.
- Default `dbSecret` is `{ name: "db", key: "endpoint" }`.
- Default container env injects `DATABASE_URL` from `dbSecret`. Pass `env` to
  override entirely.
- Defaults: `backoffLimit=3`, `activeDeadlineSeconds=120`, `ttlSecondsAfterFinished=300`.

### Observability — `observability.ct`

#### `observability({ serviceName, endpoint, serviceVersion, deploymentEnv, serviceMonitor?, dashboards?, enabled?, ... })`

Bundle: OTEL env block + `ServiceMonitor` + `GrafanaDashboards`. Returns
`{ env }` — spread into `workload().env`. Each sub-section (`serviceMonitor`,
`dashboards`) has its own `enabled` toggle.

```ts
const obs = observability({
  enabled: Values.observability.enabled,
  serviceName: APP,
  endpoint: "http://tempo.monitoring.svc.cluster.local:4317",
  serviceVersion: Values.image.tag,
  deploymentEnv: "production",
  serviceMonitor: { port: "http" },
  dashboards: { instanceLabel: "grafana", entries: [{ id: "main", json: dash }] },
});
workload({ name: APP, ..., env: { ...obs.env } });
```

#### `prometheusServiceMonitor({ name, appLabel, port, path?, interval?, scrapeTimeout?, honorLabels?, release?, enabled? })`

Lower-level. `release` defaults to `prometheus-kube-prometheus`.

#### `grafanaDashboards({ app, instanceLabel, dashboards, resyncPeriod?, allowCrossNamespaceImport?, enabled? })`

Lower-level. `allowCrossNamespaceImport` defaults to `true` (Grafana CR lives
in `monitoring`, dashboards ship in the project namespace).

#### `otelEnv({ serviceName, endpoint, serviceVersion, deploymentEnv, ... })`

Lower-level. Returns the `OTEL_*` env block as `Record<string, string>`. Use
`observability(...)` instead unless you only need OTEL env without monitors.

## Example — full project setup

```ts
import {
  env,
  infisicalSecrets,
  observability,
  postgres,
  route,
  vol,
  workload,
} from "github.com/devticon/ct@master";

import dashboardJson from "./dashboards/main.json";

const APP = "myapp";
const PORT = 3000;
const fullImage = () => `${Values.image.name}:${Values.image.tag}`;

infisicalSecrets({
  enabled: Values.projectSecrets.enabled,
  name: "secrets",
  project: Values.projectSecrets.project,
  env: Values.secretEnv,
});

const db = postgres({
  name: "postgres",
  instances: Values.postgres.instances,
  migration: {
    enabled: Values.migration.enabled,
    image: fullImage(),
    tag: Values.image.tag,
    command: ["npm", "run", "db:migrate"],
    imagePullSecrets: Values.imagePullSecrets,
  },
});

const redis = workload({
  enabled: Values.redis.enabled,
  name: `${APP}-redis`,
  image: "redis:7-alpine",
  port: 6379,
  probes: false,
});

const obs = observability({
  enabled: Values.observability.enabled,
  serviceName: APP,
  endpoint: "http://tempo.monitoring.svc.cluster.local:4317",
  serviceVersion: Values.image.tag,
  deploymentEnv: "production",
  serviceMonitor: { port: "http" },
  dashboards: { instanceLabel: "grafana", entries: [{ id: "main", json: dashboardJson }] },
});

workload({
  name: APP,
  image: fullImage(),
  port: PORT,
  env: {
    DATABASE_URL: db.envUrl(),
    REDIS_URL: redis.url("redis"),  // undefined when redis disabled — dropped
    ...obs.env,
  },
});

route({
  name: APP,
  host: Values.host,
  serviceHost: APP,
  servicePort: 80,
  customGateway: Values.customGateway ? { httpsRedirect: true } : false,
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
- Factories accept a single options object with `enabled?: boolean` at top
  level. Optional fields use `?` and default via `??` inside the body.
- When disabled, return a stub handle of the same shape (`envUrl()` / `url()`
  return `undefined`, env-bundles return `{ env: {} }`) so callers don't need
  optional chaining.
- Export factory functions as named `const` (or `export function` for the few
  that have generic constraints) — match existing files.
- Add a short JSDoc-style comment above each factory explaining the **why**
  behind defaults, not the what (the type signature already says what).
- Keep factories thin — they should hide one Devticon convention (e.g. "we
  always use `letsencrypt-cf-prod`") rather than re-implement the underlying
  Kubernetes resource.
