import { json, type LoaderArgs } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import { Header, StatusBadge, JoinOrCreate, GamesList } from "~/components";

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

  const { gameId } = useParams();
  const { pathname } = useLocation();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <JoinOrCreate />
      <main className="flex h-full bg-white">
        <div className="w-full border-r bg-gray-50 sm:h-full sm:w-80">
          <Link to={"."}>
            <h2 className="flex flex-row p-4 text-2xl text-gray-600">
              Hosted Games
              {gameId ? (
                <>
                  <svg
                    className="mt-1 h-8 w-8 rotate-90 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </>
              ) : null}
            </h2>
          </Link>
          <hr />
          <div className="sm:hidden">
            {!gameId ? (
              <>
                <Link to="new" className="block p-4 text-xl text-blue-500">
                  + New Game
                </Link>
                <hr />
              </>
            ) : null}
          </div>
          <div className="hidden sm:flex">
            {
              <>
                <Link to="new" className="block p-4 text-xl text-blue-500">
                  + New Game
                </Link>
                <hr />
              </>
            }
          </div>

          {!data || data?.length === 0 ? (
            <p className="p-4">No Games yet</p>
          ) : (
            <>
              <div className="sm:hidden">
                {!gameId && pathname !== "/create/new" ? (
                  <GamesList games={data} />
                ) : null}
                <div className="m-4">
                  <Outlet />
                </div>
              </div>
              <div className="hidden sm:flex">{<GamesList games={data} />}</div>
            </>
          )}
        </div>

        <div className="hidden flex-1 p-6 sm:flex">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
