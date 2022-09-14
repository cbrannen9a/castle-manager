import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { deleteGame, type Game, getGame } from "~/models/game.server";

type LoaderData = {
  game: Game;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ userId, _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ game });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  await deleteGame({ userId, _id: params.gameId });

  return redirect("/games");
};

export default function GameDetailsPage() {
  const data = useLoaderData() as LoaderData;
  return (
    <div>
      <h3 className="text-2xl font-bold">{data.game.title}</h3>
      <hr className="my-4" />
      <Link
        to={`/game/${data.game._id}`}
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Join
      </Link>

      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
