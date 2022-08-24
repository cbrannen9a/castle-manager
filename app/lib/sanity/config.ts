export const config = {
  apiVersion: "2021-03-25",
  // Find these in your ./studio/sanity.json file
  dataset: process.env.SANITY_DATASET ?? "production",
  projectId: process.env.SANITY_PROJECT_ID ?? ``,
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_TOKEN ?? "",
};
