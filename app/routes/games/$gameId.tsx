import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Game, getGame, getGameQuery } from "~/models/game.server";
import { PlayerCount, PlayerId } from "~/components";
import { useSubscription } from "~/lib/sanity";
import { getProfilesByIds } from "~/models/user.server";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ _id: params.gameId });
  if (!game) {
    return new Response("Not Found");
  }
  const { query, queryParams } = getGameQuery({
    _id: params.gameId,
  });

  const playerData = await getProfilesByIds(game.players);

  return json({ game, query, queryParams, playerData });
}

export default function GameDetailsPage() {
  const { game, query, queryParams, playerData } =
    useLoaderData<typeof loader>();

  const { data } = useSubscription<Game>({
    query,
    queryParams,
    initialData: game,
  });

  if (!data) {
    return <>No Game</>;
  }

  const { _id, title, players, maxPlayers, status } = data;
  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <hr className="my-4" />
      <p>{`${status}`}</p>
      <PlayerCount current={players?.length} max={maxPlayers} />
      <ul>
        {players?.map((player) => (
          <li key={player}>
            <PlayerId player={playerData[player]} />
          </li>
        ))}
      </ul>
      <Link
        to={`/game/${_id}/${status}`}
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Join
      </Link>
    </div>
  );
}
