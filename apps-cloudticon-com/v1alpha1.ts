/* eslint-disable */
/**
 * This file was automatically generated from a Kubernetes CRD.
 * DO NOT MODIFY IT BY HAND.
 */

import { resource, z } from "github.com/cloudticon/k8s@master";

export const app = /* @__PURE__ */ resource(
  "apps.cloudticon.com/v1alpha1",
  "App",
  {
    scope: "Namespaced",
    spec: {
      discordChannelId: z.string().optional(),
      globalValues: z.record(z.string()).optional(),
      importSecrets: z
        .object({
          environment: z.string(),
          projectId: z.string(),
        })
        .optional(),
      namespace: z.string(),
      project: z.string(),
      prune: z.boolean().default(false),
      repositories: z.array(
        z.object({
          branch: z.string(),
          name: z.string(),
          path: z.string().default("helm"),
          url: z.string(),
          values: z.record(z.string()).optional(),
        }),
      ),
      selfHeal: z.boolean().default(false),
      sentry: z
        .object({
          gateway: z.string(),
          host: z.string().optional(),
          hosts: z.array(z.string()).optional(),
          pathPrefix: z.string().optional(),
        })
        .optional(),
      title: z.string().optional(),
      urls: z
        .array(
          z.object({
            name: z.string(),
            url: z.string(),
          }),
        )
        .optional(),
    },
    status: {
      discordMessageId: z.string().optional(),
      repositories: z
        .record(
          z.object({
            branch: z.string().optional(),
            commit: z.string().optional(),
            repoUrl: z.string().optional(),
            status: z.string().optional(),
          }),
        )
        .default({}),
      status: z.string().default("Pending"),
    },
  },
);

export const hasura = /* @__PURE__ */ resource(
  "apps.cloudticon.com/v1alpha1",
  "Hasura",
  {
    scope: "Namespaced",
    spec: {
      adminSecret: z.object({
        key: z.string(),
        name: z.string().default(""),
        optional: z.boolean().optional(),
      }),
      auth: z
        .object({
          webhookMode: z.string().default("POST"),
          webhookUrl: z.string().optional(),
        })
        .optional(),
      authWebhookUrl: z.string().optional(),
      console: z.boolean().default(true),
      databaseUrl: z.object({
        key: z.string(),
        name: z.string().default(""),
        optional: z.boolean().optional(),
      }),
      dev: z
        .object({
          apiPort: z.number().default(9695),
          consolePort: z.number().default(9693),
          externalUrl: z.string(),
        })
        .optional(),
      enableRemoteSchemaPermissions: z.boolean().default(false),
      env: z
        .array(
          z.object({
            name: z.string(),
            value: z.string().optional(),
            valueFrom: z
              .object({
                configMapKeyRef: z
                  .object({
                    key: z.string(),
                    name: z.string().default(""),
                    optional: z.boolean().optional(),
                  })
                  .optional(),
                fieldRef: z
                  .object({
                    apiVersion: z.string().optional(),
                    fieldPath: z.string(),
                  })
                  .optional(),
                resourceFieldRef: z
                  .object({
                    containerName: z.string().optional(),
                    divisor: z.string().optional(),
                    resource: z.string(),
                  })
                  .optional(),
                secretKeyRef: z
                  .object({
                    key: z.string(),
                    name: z.string().default(""),
                    optional: z.boolean().optional(),
                  })
                  .optional(),
              })
              .optional(),
          }),
        )
        .optional(),
      eventCleanerJob: z
        .object({
          cron: z.string().default("0 0 * * *"),
          enabled: z.boolean().default(true),
        })
        .default({}),
      experimentalFeatures: z.array(z.string()).default(["naming_convention"]),
      functionsUrl: z.string().default("http://functions:8080"),
      image: z
        .object({
          name: z.string(),
          tag: z.string(),
        })
        .optional(),
      logs: z
        .object({
          level: z.string().default("info"),
          types: z
            .array(z.string())
            .default([
              "startup",
              "query-log",
              "http-log",
              "webhook-log",
              "websocket-log",
            ]),
        })
        .default({}),
      metadataDatabaseUrl: z
        .object({
          key: z.string(),
          name: z.string().default(""),
          optional: z.boolean().optional(),
        })
        .optional(),
      replicas: z.number().default(1),
      resources: z
        .object({
          claims: z
            .array(
              z.object({
                name: z.string(),
                request: z.string().optional(),
              }),
            )
            .optional(),
          limits: z.record(z.string()).optional(),
          requests: z.record(z.string()).optional(),
        })
        .optional(),
      runMigration: z.boolean().default(true),
      version: z.string().default("2.36.8"),
    },
    status: {
      conditions: z
        .array(
          z.object({
            lastTransitionTime: z.string(),
            message: z.string(),
            observedGeneration: z.number().optional(),
            reason: z.string(),
            status: z.enum(["True", "False", "Unknown"]),
            type: z.string(),
          }),
        )
        .optional(),
      migrationRunning: z.boolean().optional(),
      migrationTag: z.string().optional(),
    },
  },
);

export const importedSecret = /* @__PURE__ */ resource(
  "apps.cloudticon.com/v1alpha1",
  "ImportedSecret",
  {
    scope: "Namespaced",
    spec: {
      overwrites: z.record(z.record(z.string())).optional(),
      path: z.string(),
      templates: z.record(z.record(z.string())).optional(),
    },
    status: {},
  },
);

export const postgres = /* @__PURE__ */ resource(
  "apps.cloudticon.com/v1alpha1",
  "Postgres",
  {
    scope: "Namespaced",
    spec: {
      affinity: z
        .object({
          additionalPodAffinity: z
            .object({
              preferredDuringSchedulingIgnoredDuringExecution: z
                .array(
                  z.object({
                    podAffinityTerm: z.object({
                      labelSelector: z
                        .object({
                          matchExpressions: z
                            .array(
                              z.object({
                                key: z.string(),
                                operator: z.string(),
                                values: z.array(z.string()).optional(),
                              }),
                            )
                            .optional(),
                          matchLabels: z.record(z.string()).optional(),
                        })
                        .optional(),
                      matchLabelKeys: z.array(z.string()).optional(),
                      mismatchLabelKeys: z.array(z.string()).optional(),
                      namespaceSelector: z
                        .object({
                          matchExpressions: z
                            .array(
                              z.object({
                                key: z.string(),
                                operator: z.string(),
                                values: z.array(z.string()).optional(),
                              }),
                            )
                            .optional(),
                          matchLabels: z.record(z.string()).optional(),
                        })
                        .optional(),
                      namespaces: z.array(z.string()).optional(),
                      topologyKey: z.string(),
                    }),
                    weight: z.number(),
                  }),
                )
                .optional(),
              requiredDuringSchedulingIgnoredDuringExecution: z
                .array(
                  z.object({
                    labelSelector: z
                      .object({
                        matchExpressions: z
                          .array(
                            z.object({
                              key: z.string(),
                              operator: z.string(),
                              values: z.array(z.string()).optional(),
                            }),
                          )
                          .optional(),
                        matchLabels: z.record(z.string()).optional(),
                      })
                      .optional(),
                    matchLabelKeys: z.array(z.string()).optional(),
                    mismatchLabelKeys: z.array(z.string()).optional(),
                    namespaceSelector: z
                      .object({
                        matchExpressions: z
                          .array(
                            z.object({
                              key: z.string(),
                              operator: z.string(),
                              values: z.array(z.string()).optional(),
                            }),
                          )
                          .optional(),
                        matchLabels: z.record(z.string()).optional(),
                      })
                      .optional(),
                    namespaces: z.array(z.string()).optional(),
                    topologyKey: z.string(),
                  }),
                )
                .optional(),
            })
            .optional(),
          additionalPodAntiAffinity: z
            .object({
              preferredDuringSchedulingIgnoredDuringExecution: z
                .array(
                  z.object({
                    podAffinityTerm: z.object({
                      labelSelector: z
                        .object({
                          matchExpressions: z
                            .array(
                              z.object({
                                key: z.string(),
                                operator: z.string(),
                                values: z.array(z.string()).optional(),
                              }),
                            )
                            .optional(),
                          matchLabels: z.record(z.string()).optional(),
                        })
                        .optional(),
                      matchLabelKeys: z.array(z.string()).optional(),
                      mismatchLabelKeys: z.array(z.string()).optional(),
                      namespaceSelector: z
                        .object({
                          matchExpressions: z
                            .array(
                              z.object({
                                key: z.string(),
                                operator: z.string(),
                                values: z.array(z.string()).optional(),
                              }),
                            )
                            .optional(),
                          matchLabels: z.record(z.string()).optional(),
                        })
                        .optional(),
                      namespaces: z.array(z.string()).optional(),
                      topologyKey: z.string(),
                    }),
                    weight: z.number(),
                  }),
                )
                .optional(),
              requiredDuringSchedulingIgnoredDuringExecution: z
                .array(
                  z.object({
                    labelSelector: z
                      .object({
                        matchExpressions: z
                          .array(
                            z.object({
                              key: z.string(),
                              operator: z.string(),
                              values: z.array(z.string()).optional(),
                            }),
                          )
                          .optional(),
                        matchLabels: z.record(z.string()).optional(),
                      })
                      .optional(),
                    matchLabelKeys: z.array(z.string()).optional(),
                    mismatchLabelKeys: z.array(z.string()).optional(),
                    namespaceSelector: z
                      .object({
                        matchExpressions: z
                          .array(
                            z.object({
                              key: z.string(),
                              operator: z.string(),
                              values: z.array(z.string()).optional(),
                            }),
                          )
                          .optional(),
                        matchLabels: z.record(z.string()).optional(),
                      })
                      .optional(),
                    namespaces: z.array(z.string()).optional(),
                    topologyKey: z.string(),
                  }),
                )
                .optional(),
            })
            .optional(),
          enablePodAntiAffinity: z.boolean().optional(),
          nodeAffinity: z
            .object({
              preferredDuringSchedulingIgnoredDuringExecution: z
                .array(
                  z.object({
                    preference: z.object({
                      matchExpressions: z
                        .array(
                          z.object({
                            key: z.string(),
                            operator: z.string(),
                            values: z.array(z.string()).optional(),
                          }),
                        )
                        .optional(),
                      matchFields: z
                        .array(
                          z.object({
                            key: z.string(),
                            operator: z.string(),
                            values: z.array(z.string()).optional(),
                          }),
                        )
                        .optional(),
                    }),
                    weight: z.number(),
                  }),
                )
                .optional(),
              requiredDuringSchedulingIgnoredDuringExecution: z
                .object({
                  nodeSelectorTerms: z.array(
                    z.object({
                      matchExpressions: z
                        .array(
                          z.object({
                            key: z.string(),
                            operator: z.string(),
                            values: z.array(z.string()).optional(),
                          }),
                        )
                        .optional(),
                      matchFields: z
                        .array(
                          z.object({
                            key: z.string(),
                            operator: z.string(),
                            values: z.array(z.string()).optional(),
                          }),
                        )
                        .optional(),
                    }),
                  ),
                })
                .optional(),
            })
            .optional(),
          nodeSelector: z.record(z.string()).optional(),
          podAntiAffinityType: z.string().optional(),
          tolerations: z
            .array(
              z.object({
                effect: z.string().optional(),
                key: z.string().optional(),
                operator: z.string().optional(),
                tolerationSeconds: z.number().optional(),
                value: z.string().optional(),
              }),
            )
            .optional(),
          topologyKey: z.string().optional(),
        })
        .optional(),
      backup: z
        .object({
          cron: z.string().default("0 0 0 * * *"),
          name: z.string().optional(),
          namespace: z.string().optional(),
          version: z.string().optional(),
        })
        .optional(),
      import: z
        .object({
          db: z.string().default("app"),
          host: z.string(),
          port: z.number().default(5432),
          schema: z.string().optional(),
          secret: z.string(),
          user: z.string().default("app"),
        })
        .optional(),
      instances: z.number().default(1),
      monitoring: z.boolean().default(true),
      postInitSql: z.array(z.string()).optional(),
      postgresql: z
        .object({
          enableAlterSystem: z.boolean().optional(),
          ldap: z
            .object({
              bindAsAuth: z
                .object({
                  prefix: z.string().optional(),
                  suffix: z.string().optional(),
                })
                .optional(),
              bindSearchAuth: z
                .object({
                  baseDN: z.string().optional(),
                  bindDN: z.string().optional(),
                  bindPassword: z
                    .object({
                      key: z.string(),
                      name: z.string().default(""),
                      optional: z.boolean().optional(),
                    })
                    .optional(),
                  searchAttribute: z.string().optional(),
                  searchFilter: z.string().optional(),
                })
                .optional(),
              port: z.number().optional(),
              scheme: z.enum(["ldap", "ldaps"]).optional(),
              server: z.string().optional(),
              tls: z.boolean().optional(),
            })
            .optional(),
          parameters: z.record(z.string()).optional(),
          pg_hba: z.array(z.string()).optional(),
          pg_ident: z.array(z.string()).optional(),
          promotionTimeout: z.number().optional(),
          shared_preload_libraries: z.array(z.string()).optional(),
          syncReplicaElectionConstraint: z
            .object({
              enabled: z.boolean(),
              nodeLabelsAntiAffinity: z.array(z.string()).optional(),
            })
            .optional(),
          synchronous: z
            .object({
              dataDurability: z
                .enum(["required", "preferred"])
                .default("required"),
              maxStandbyNamesFromCluster: z.number().optional(),
              method: z.enum(["any", "first"]),
              number: z.number(),
              standbyNamesPost: z.array(z.string()).optional(),
              standbyNamesPre: z.array(z.string()).optional(),
            })
            .optional(),
        })
        .optional(),
      recovery: z
        .object({
          backupID: z.string().optional(),
          cluster: z.string().optional(),
          fullPath: z.string().optional(),
          name: z.string().optional(),
          namespace: z.string().optional(),
          version: z.string().optional(),
        })
        .optional(),
      resources: z
        .object({
          claims: z
            .array(
              z.object({
                name: z.string(),
                request: z.string().optional(),
              }),
            )
            .optional(),
          limits: z.record(z.string()).optional(),
          requests: z.record(z.string()).optional(),
        })
        .optional(),
      secret: z.string(),
      storage: z
        .object({
          class: z.string().optional(),
          size: z.string().optional(),
        })
        .default({ class: "local-path", size: "10Gi" }),
      tablespaces: z
        .array(
          z.object({
            name: z.string(),
            owner: z
              .object({
                name: z.string().optional(),
              })
              .optional(),
            storage: z.object({
              pvcTemplate: z
                .object({
                  accessModes: z.array(z.string()).optional(),
                  dataSource: z
                    .object({
                      apiGroup: z.string().optional(),
                      kind: z.string(),
                      name: z.string(),
                    })
                    .optional(),
                  dataSourceRef: z
                    .object({
                      apiGroup: z.string().optional(),
                      kind: z.string(),
                      name: z.string(),
                      namespace: z.string().optional(),
                    })
                    .optional(),
                  resources: z
                    .object({
                      limits: z.record(z.string()).optional(),
                      requests: z.record(z.string()).optional(),
                    })
                    .optional(),
                  selector: z
                    .object({
                      matchExpressions: z
                        .array(
                          z.object({
                            key: z.string(),
                            operator: z.string(),
                            values: z.array(z.string()).optional(),
                          }),
                        )
                        .optional(),
                      matchLabels: z.record(z.string()).optional(),
                    })
                    .optional(),
                  storageClassName: z.string().optional(),
                  volumeAttributesClassName: z.string().optional(),
                  volumeMode: z.string().optional(),
                  volumeName: z.string().optional(),
                })
                .optional(),
              resizeInUseVolumes: z.boolean().default(true),
              size: z.string().optional(),
              storageClass: z.string().optional(),
            }),
            temporary: z.boolean().default(false),
          }),
        )
        .optional(),
      useDevticonImage: z.boolean().optional(),
      walStorage: z
        .object({
          class: z.string().optional(),
          size: z.string().optional(),
        })
        .optional(),
    },
    status: {
      backupVersionSavedInVault: z.string().optional(),
      conditions: z
        .array(
          z.object({
            lastTransitionTime: z.string(),
            message: z.string(),
            observedGeneration: z.number().optional(),
            reason: z.string(),
            status: z.enum(["True", "False", "Unknown"]),
            type: z.string(),
          }),
        )
        .optional(),
      phase: z.string().optional(),
    },
  },
);

export const projectSecrets = /* @__PURE__ */ resource(
  "apps.cloudticon.com/v1alpha1",
  "ProjectSecrets",
  {
    scope: "Namespaced",
    spec: {
      env: z.string(),
      project: z.string(),
    },
    status: {
      conditions: z
        .array(
          z.object({
            lastTransitionTime: z.string(),
            message: z.string(),
            observedGeneration: z.number().optional(),
            reason: z.string(),
            status: z.enum(["True", "False", "Unknown"]),
            type: z.string(),
          }),
        )
        .optional(),
      projectName: z.string().optional(),
    },
  },
);
