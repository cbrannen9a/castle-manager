import { type ClientConfig } from "@sanity/client";

export function getSanityConfig({
  dataset,
  projectId,
  token,
  nodeEnv,
}: Pick<ClientConfig, "dataset" | "projectId" | "token"> & {
  nodeEnv: string | undefined;
}) {
  return {
    apiVersion: "2021-03-25",
    // Find these in your ./studio/sanity.json file
    dataset: dataset ?? "production",
    projectId: projectId ?? ``,
    useCdn: nodeEnv === "production",
    token: token ?? "",
  };
}
