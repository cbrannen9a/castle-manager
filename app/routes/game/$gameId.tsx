import {
  json,
  redirect,
  type LoaderArgs,
  type ActionArgs,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getGame, startGame } from "~/models/game.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ userId, _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ game });
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
  const {
    game: { title, status, maxPlayers },
  } = useLoaderData();
  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <hr className="my-4" />
      {status}
      {maxPlayers}
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
