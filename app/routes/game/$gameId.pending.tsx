import { json, redirect, type LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getGame } from "~/models/game.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ userId, _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }
  if (game.status !== "pending") {
    return redirect(`/game/${game._id}/${game.status}`);
  }

  return json({ game });
};

export default function GameIndexPage() {
  return <p>New Game</p>;
}
