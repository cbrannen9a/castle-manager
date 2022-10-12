import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  type Game,
  getGame,
  getGameQuery,
  type GameStatus,
  removePlayer,
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
  const isHost = userId === game.host;
  return json({
    game,
    query,
    queryParams,
    playerData,
    currentUser: userId,
    isHost,
  });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.gameId, "gameId not found");

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent?.toString().includes("removePlayer")) {
    const removeUserIndex = intent.toString().split(" ")[1];
    await removePlayer({ userIndex: removeUserIndex, _id: params.gameId });
    return {};
  }
  return null;
}

function statusButtonMessage(status: GameStatus, isHost: boolean) {
  switch (status) {
    case "completed":
      return "View";

    case "pending":
      return isHost ? "Setup" : " Join";

    case "inProgress":
    default:
      return "Join";
  }
}

export default function GameDetailsPage() {
  const { game, query, queryParams, playerData, currentUser, isHost } =
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
    <div className="w-full">
      <Form method="post">
        <GameDetails
          title={title}
          players={players}
          maxPlayers={maxPlayers}
          status={status}
          playerData={playerData}
          host={host}
          currentUser={currentUser}
        />
      </Form>
      {status !== "error" ? (
        <Link
          to={`/game/${_id}/${status}`}
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          {statusButtonMessage(status, isHost)}
        </Link>
      ) : null}
    </div>
  );
}
