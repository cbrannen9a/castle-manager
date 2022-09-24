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
import { config } from "./lib";
import { SanityContextProvider } from "./contexts";

export const meta: MetaFunction = () => {
  return { title: "Castle" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
    config: { ...config, token: null },
  });
}

export default function App() {
  const {
    config: { apiVersion, dataset, projectId, useCdn },
  } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <SanityContextProvider
          apiVersion={apiVersion}
          dataset={dataset}
          projectId={projectId}
          useCdn={useCdn}
        >
          <Outlet />
        </SanityContextProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
