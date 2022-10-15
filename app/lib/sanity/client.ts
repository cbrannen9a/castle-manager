import sanityClient from "@sanity/client";

import { getSanityConfig } from "./getSanityConfig";

const config = getSanityConfig({
  dataset: process.env.SANITY_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_TOKEN ?? "",
  nodeEnv: process.env.NODE_ENV,
});

// Standard client for fetching data
export const client = new sanityClient(config);
