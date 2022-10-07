import { json, type LoaderArgs } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import { GamesList, Header, JoinOrCreate, StatusBadge } from "~/components";
import { sortByGameStatus } from "~/helpers";
import { useSubscriptionToList } from "~/lib/sanity";
import { getGameListItems, getGameListItemsQuery } from "~/models/game.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const gameListItems = await getGameListItems({ userId });
  const { query, queryParams } = getGameListItemsQuery({ userId });

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

  return (
    <div>
      <Header />
      <JoinOrCreate />
      <main className="flex h-full bg-white">
        <div className="w-full border-r bg-gray-50 sm:h-full sm:w-80">
          {!data || data?.length === 0 ? (
            <p className="p-4">No Games yet</p>
          ) : (
            <>
              <Link to={"."}>
                <h2 className="flex p-4 text-2xl text-gray-600">
                  Games
                  {gameId ? (
                    <>
                      <svg
                        className="h-8 w-8 rotate-90 text-gray-600"
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
              <>
                <div className="sm:hidden">
                  {!gameId ? <GamesList games={data} /> : null}
                  <div className="m-4">
                    <Outlet />
                  </div>
                </div>
                <div className="hidden sm:flex">
                  {<GamesList games={data} />}
                </div>
              </>
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
