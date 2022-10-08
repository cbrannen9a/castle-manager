import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import {
  deleteGame,
  type GameStatus,
  getGameAsHost,
  getGameAsHostQuery,
} from "~/models/game.server";
import { GameDetails } from "~/components";
import { useSubscription } from "~/lib/sanity";
import { getProfilesByIds } from "~/models/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGameAsHost({ userId, _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }
  const { query, queryParams } = getGameAsHostQuery({
    userId,
    _id: params.gameId,
  });

  const playerData = await getProfilesByIds(game.players);

  return json({ game, query, queryParams, playerData, currentUser: userId });
}

function statusButtonMessage(status: GameStatus) {
  switch (status) {
    case "completed":
      return "View";

    case "pending":
      return "Start";
    case "inProgress":
    default:
      return "Join";
  }
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  await deleteGame({ userId, _id: params.gameId });

  return redirect("/create");
}

export default function GameDetailsPage() {
  const { game, query, queryParams, playerData, currentUser } =
    useLoaderData<typeof loader>();
  const { data } = useSubscription({
    query,
    queryParams,
    initialData: game,
  });

  if (!data) {
    return <div>No game</div>;
  }
  const { _id, title, players, maxPlayers, status, host } = data;
  return (
    <div className="w-full">
      <GameDetails
        title={title}
        players={players}
        maxPlayers={maxPlayers}
        status={status}
        playerData={playerData}
        host={host}
        currentUser={currentUser}
      />
      {status !== "error" ? (
        <Link
          to={`/game/${_id}/${status}`}
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          {statusButtonMessage(status)}
        </Link>
      ) : null}

      <Form method="post" className="my-4">
        <button
          type="submit"
          className="my-2 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}
