import {
  json,
  type LoaderArgs,
  redirect,
  type ActionArgs,
} from "@remix-run/node";
import { Form, useLoaderData, useLocation } from "@remix-run/react";

import invariant from "tiny-invariant";
import { GameDetails, PlayerCount, StatusBadge } from "~/components";
import { useSubscription } from "~/lib/sanity";
import { getGame, getGameQuery, startGame } from "~/models/game.server";
import { getProfilesByIds } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }
  if (game.status !== "pending") {
    return redirect(`/game/${game._id}/${game.status}`);
  }
  const { query, queryParams } = getGameQuery({ _id: params.gameId });
  const isHost = userId === game.host;
  const playerData = await getProfilesByIds(game.players);
  return json({
    game,
    query,
    queryParams,
    isHost,
    currentUser: userId,
    playerData,
  });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  invariant(params.gameId, "gameId not found");
  if (intent === "start") {
    await startGame({ userId, _id: params.gameId });

    return redirect(`/game/${params.gameId}/pending`);
  }
  if (intent === "join") {
    return redirect(`/game/${params.gameId}/inProgress`);
  }
  return redirect(`/game/${params.gameId}/error`);
}

export default function GameDetailsPage() {
  const { game, query, queryParams, isHost, currentUser, playerData } =
    useLoaderData<typeof loader>();
  const location = useLocation();
  console.log(location);
  const { data } = useSubscription({ query, queryParams, initialData: game });
  if (!data) {
    return <div>No game found</div>;
  }
  const { title, host, status, maxPlayers, players } = data;
  //redirect to status?
  return (
    <div>
      {isHost ? (
        <>
          <GameDetails
            title={title}
            players={players}
            maxPlayers={maxPlayers}
            status={status}
            playerData={playerData}
            host={host}
            currentUser={currentUser}
          />
          <p></p>
        </>
      ) : (
        <>
          <StatusBadge status={status} />
          <PlayerCount current={players?.length} max={maxPlayers} />
        </>
      )}

      {status === "pending" && isHost ? (
        <Form method="post">
          <button
            type="submit"
            name="intent"
            value="start"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Start
          </button>
        </Form>
      ) : (
        <p>Waiting for Host to Start...</p>
      )}
      {status === "inProgress" ? (
        <Form method="post">
          <button
            type="submit"
            name="intent"
            value="join"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Join
          </button>
        </Form>
      ) : null}
    </div>
  );
}
