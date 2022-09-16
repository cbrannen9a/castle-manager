import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { createGame } from "~/models/game.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const maxPlayers = parseInt(formData.get("maxPlayers") as string);

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", maxPlayers: null } },
      { status: 400 }
    );
  }

  if (typeof maxPlayers !== "number" || maxPlayers < 1 || maxPlayers > 8) {
    return json(
      { errors: { title: null, maxPlayers: "Max Players is between 1 and 8" } },
      { status: 400 }
    );
  }

  const game = await createGame({ title, maxPlayers, userId });
  if (!game) {
    throw new Error("Unable to create game");
  }
  return redirect(`/games/${game._id}`);
}

export default function NewGamePage() {
  const [maxPlayers, setMaxPlayers] = useState<number>(8);
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const maxPlayersRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef?.current?.focus();
    }

    if (actionData?.errors?.maxPlayers) {
      maxPlayersRef?.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            ref={titleRef}
          />
          {actionData?.errors?.title && (
            <span className="block pt-1 text-red-700" id="email-error">
              {actionData?.errors?.title}
            </span>
          )}
        </label>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Max Players: </span>
          <input
            name="maxPlayers"
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            ref={maxPlayersRef}
          />
          {actionData?.errors?.maxPlayers && (
            <span className="block pt-1 text-red-700" id="email-error">
              {actionData?.errors?.maxPlayers}
            </span>
          )}
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
