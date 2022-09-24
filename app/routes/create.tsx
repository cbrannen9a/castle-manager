import { json, type LoaderArgs } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { Header, StatusBadge } from "~/components";
import { sortByGameStatus } from "~/helpers";
import { useSubscriptionToList } from "~/lib/sanity";
import {
  getGameListItemsAsHost,
  getGameListItemsAsHostQuery,
} from "~/models/game.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const gameListItems = await getGameListItemsAsHost({ userId });
  const { query, queryParams } = getGameListItemsAsHostQuery({ userId });

  return json({ gameListItems, userId, query, queryParams });
}

export function ErrorBoundary(error: Error) {
  console.log(error);
  return <div>Error</div>;
}

export default function GamesPage() {
  const { gameListItems, query, queryParams } = useLoaderData<typeof loader>();
  const { data } = useSubscriptionToList({
    query,
    queryParams,
    initialData: gameListItems,
  });

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <JoinOrCreate />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <h2 className="block bg-slate-400 p-4 text-xl text-white">
            Hosted Games
          </h2>
          <hr />
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Game
          </Link>

          <hr />

          {!data || data?.length === 0 ? (
            <p className="p-4">No Games yet</p>
          ) : (
            <ol>
              {data.sort(sortByGameStatus).map((game) => (
                <li key={game._id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={game._id}
                  >
                    🏰 {game.title} <StatusBadge status={game.status} />
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function JoinOrCreate() {
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
        Create
      </Link>
    </div>
  );
}
