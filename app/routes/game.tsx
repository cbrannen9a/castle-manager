import { redirect, type LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import { getGame } from "~/models/game.server";

export async function loader({ request, params }: LoaderArgs) {
  if (!params.gameId) {
    return redirect("/games");
  }

  const game = await getGame({ _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ game });
}

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
  const { game } = useLoaderData<typeof loader>();
  return (
    <header className="flex w-full items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to={`/game/${game._id}/${game.status}`}>{game.title}</Link>
      </h1>
      <Link
        to={"/games"}
        className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
      >
        Back
      </Link>
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
