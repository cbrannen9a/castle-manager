import sanityClient from "@sanity/client";
import { useMemo } from "react";
import { useSanityContext } from "~/contexts";

export default function useSanityClient() {
  const { apiVersion, dataset, projectId, useCdn } = useSanityContext();

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
