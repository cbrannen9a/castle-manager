import { Link } from "@remix-run/react";

export default function GameIndexPage() {
  return (
    <p>
      {`No Game selected. Select a game or `}
      <Link to="/create/new" className="text-blue-500 underline">
        create a new game as Host
      </Link>
    </p>
  );
}
