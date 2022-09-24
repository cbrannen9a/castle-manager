import { Link } from "@remix-run/react";

export default function JoinOrCreate() {
  return (
    <div className="flex w-full items-center justify-around border-b p-4">
      <Link
        to="/games"
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Join
      </Link>
      <Link
        to="/create"
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Host
      </Link>
    </div>
  );
}
