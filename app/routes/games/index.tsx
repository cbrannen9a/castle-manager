import { Link } from "@remix-run/react";

export default function GameIndexPage() {
  return (
    <p>
      No Game selected. Select a game on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new game.
      </Link>
    </p>
  );
}
