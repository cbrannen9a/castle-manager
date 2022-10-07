import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  type Game,
  getGame,
  getGameQuery,
  type GameStatus,
} from "~/models/game.server";
import { GameDetails } from "~/components";
import { useSubscription } from "~/lib/sanity";
import { getProfilesByIds } from "~/models/user.server";
import { getUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ _id: params.gameId });
  const userId = await getUserId(request);
  if (!game) {
    return new Response("Not Found");
  }
  const { query, queryParams } = getGameQuery({
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
    case "inProgress":
    default:
      return "Join";
  }
}

export default function GameDetailsPage() {
  const { game, query, queryParams, playerData, currentUser } =
    useLoaderData<typeof loader>();

  const { data } = useSubscription<Game>({
    query,
    queryParams,
    initialData: game,
  });

  if (!data) {
    return <>No Game</>;
  }

  const { _id, title, players, maxPlayers, status, host } = data;
  return (
    <div>
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
    </div>
  );
}
