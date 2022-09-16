import { type LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderArgs) {
  invariant(params.gameId, "gameId not found");

  return {};
}

export default function GameDetailsPage() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
