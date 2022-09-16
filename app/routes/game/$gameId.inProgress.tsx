import { json, redirect, type LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getGame } from "~/models/game.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ userId, _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }
  if (game.status !== "inProgress") {
    return redirect(`/game/${game._id}/${game.status}`);
  }

  return json({ game });
}

export default function GameIndexPage() {
  return <p>InProgress Game</p>;
}
