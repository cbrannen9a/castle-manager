import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { type Game, getGameListItems } from "~/models/game.server";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

type LoaderData = {
  noteListItems: Game[];
};

// export const loader: LoaderFunction = async ({ request }) => {
//   const userId = await requireUserId(request);
//   const noteListItems = await getGameListItems({ userId });
//   return json({ noteListItems });
// };

export default function GamePage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex h-full bg-white">
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Header() {
  const user = useUser();
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to=".">Game</Link>
      </h1>
      <p>{user.email}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}
