import {
  type ActionArgs,
  json,
  redirect,
  type LoaderArgs,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getGame, joinGameAsPlayer } from "~/models/game.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request, `invite/${params.gameId}`);
  invariant(params.gameId, "gameId not found");

  const game = await getGame({ _id: params.gameId });
  if (!game) {
    throw new Response("Not Found", { status: 404 });
  }

  if (game.host === userId) {
    return redirect(`/game/${params.gameId}/${game.status}`);
  }

  if (game.players && game.players.length >= game.maxPlayers) {
    return redirect(`${params.gameId}/full`);
  }

  return json({ game });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  invariant(params.gameId, "gameId not found");
  if (intent === "join") {
    await joinGameAsPlayer({ userId, _id: params.gameId });

    return redirect(`/game/${params.gameId}/pending`);
  }

  return redirect(`${params.gameId}/error`);
}

export default function GameIndexPage() {
  return (
    <p>
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
    </p>
  );
}
