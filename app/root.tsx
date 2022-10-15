import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./session.server";
import { getSanityConfig } from "./lib";
import { getSite } from "./models/site.server";
import { getEnv } from "./env.server";

export const meta: MetaFunction = () => {
  return { title: "Castle" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export async function loader({ request }: LoaderArgs) {
  const ENV = getEnv();
  const sanityConfig = getSanityConfig({
    dataset: ENV.SANITY_DATASET,
    projectId: ENV.SANITY_PROJECT_ID,
    nodeEnv: ENV.NODE_ENV,
  });

  return json({
    user: await getUser(request),
    sanityConfig,
    site: await getSite(),
    ENV,
  });
}

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-screen w-screen">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full w-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}
