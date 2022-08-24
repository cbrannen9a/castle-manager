import sanityClient from "@sanity/client";

import { config } from "./config";

// Standard client for fetching data
export const client = new sanityClient(config);
