import {
  json,
  type LoaderArgs,
  redirect,
  type ActionArgs,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";
import { PlayerCount } from "~/components";
import { useSubscription } from "~/lib/sanity";
import { getGame, getGameQuery, startGame } from "~/models/game.server";
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
  return json({ game, query, queryParams });
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
  const { game, query, queryParams } = useLoaderData<typeof loader>();

  const { data } = useSubscription({ query, queryParams, initialData: game });
  if (!data) {
    return <div>No game found</div>;
  }

  const { status, maxPlayers, players } = data;
  return (
    <div>
      <p>{status}</p>
      <PlayerCount current={players?.length} max={maxPlayers} />
      <Form method="post">
        {status === "pending" ? (
          <button
            type="submit"
            name="intent"
            value="start"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Start
          </button>
        ) : null}
        {status === "inProgress" ? (
          <button
            type="submit"
            name="intent"
            value="join"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Join
          </button>
        ) : null}
      </Form>
    </div>
  );
}