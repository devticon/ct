/* eslint-disable */
/**
 * This file was automatically generated from a Kubernetes CRD.
 * DO NOT MODIFY IT BY HAND.
 */

import { resource, z } from "github.com/cloudticon/k8s@master";

export const k3sCluster = /* @__PURE__ */ resource(
  "cluster.cloudticon.com/v1",
  "K3sCluster",
  {
    scope: "Cluster",
    spec: {
      infisical: z.object({
        env: z.string(),
        projectId: z.string(),
      }),
    },
    status: {
      agentsLoadBalancerId: z.number().optional(),
      agentsLoadBalancerIp: z.string().optional(),
      argocdInstalled: z.boolean(),
      clusterInited: z.boolean(),
      firstServer: z.string().optional(),
      istioInstalled: z.boolean(),
      message: z.string(),
      networkId: z.number().optional(),
      ready: z.boolean(),
      serversLoadBalancerId: z.number().optional(),
      serversLoadBalancerIp: z.string().optional(),
      sshKeyId: z.number().optional(),
    },
  },
);

export const k3sNode = /* @__PURE__ */ resource(
  "cluster.cloudticon.com/v1",
  "K3sNode",
  {
    scope: "Namespaced",
    spec: {
      serverType: z.string(),
      type: z.string(),
    },
    status: {
      externalIp: z.string().optional(),
      internalIp: z.string().optional(),
      isK3sInstalled: z.boolean(),
      message: z.string(),
      ready: z.boolean(),
      serverId: z.number().optional(),
      serverReady: z.boolean(),
    },
  },
);

export const virtualMachine = /* @__PURE__ */ resource(
  "cluster.cloudticon.com/v1",
  "VirtualMachine",
  {
    scope: "Namespaced",
    spec: {
      loadBalanacerId: z.number().optional(),
      networkId: z.number().optional(),
      sshKeyId: z.number().optional(),
      type: z.string(),
    },
    status: {
      error: z.string().optional(),
      externalIp: z.string().optional(),
      id: z.number().optional(),
      internalIp: z.string().optional(),
      ready: z.boolean(),
      serverReady: z.boolean(),
    },
  },
);
