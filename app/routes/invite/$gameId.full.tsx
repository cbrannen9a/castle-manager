import { Link } from "@remix-run/react";

export default function GameIndexPage() {
  return (
    <p>
      {`Sorry the game has reach maximum players `}
      <Link to="/" className="text-blue-500 underline">
        Home
      </Link>
    </p>
  );
}
