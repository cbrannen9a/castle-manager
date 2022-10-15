import sanityClient, { type ClientConfig } from "@sanity/client";
import { useMemo } from "react";
import { useParentData } from "~/hooks";

export default function useSanityClient() {
  const data = useParentData<{ sanityConfig: ClientConfig }>("root");
  if (!data) {
    throw new Error("Unable to load required config");
  }
  const {
    sanityConfig: { apiVersion, dataset, projectId, useCdn },
  } = data;

  const client = useMemo(
    () =>
      new sanityClient({
        apiVersion,
        dataset,
        projectId,
        useCdn,
      }),
    [apiVersion, dataset, projectId, useCdn]
  );

  return client;
}
