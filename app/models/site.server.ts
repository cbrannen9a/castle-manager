import { client } from "~/lib";

export interface Site {
  status: string;
}

export async function getSite() {
  const data: Site = await client.fetch(
    `*[_type == 'site' && _id == 'site' ][0]{...}`
  );

  return data;
}
