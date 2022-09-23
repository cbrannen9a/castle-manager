import sanityClient from "@sanity/client";
import { useMemo } from "react";

export default function useSanityClient() {
  //   const { sanityDataset, sanityProjectId } = useSanityContext();
  const client = useMemo(
    () =>
      new sanityClient({
        apiVersion: "2021-03-25",
        dataset: "production",
        projectId: `ay6hp67o`,
        useCdn: false,
      }),
    []
  );

  return client;
}
