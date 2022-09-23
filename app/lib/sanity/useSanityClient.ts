import { useOutletContext } from "@remix-run/react";
import sanityClient from "@sanity/client";
import { useMemo } from "react";

export default function useSanityClient() {
  const data = useOutletContext();
  console.log(data);
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
