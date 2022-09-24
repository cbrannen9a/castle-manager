import { json, type LoaderArgs } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { Header, JoinOrCreate, StatusBadge } from "~/components";
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

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <JoinOrCreate />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {!data || data?.length === 0 ? (
            <p className="p-4">No Games yet</p>
          ) : (
            <>
              <h2 className="block bg-slate-400 p-4 text-xl text-white">
                Available Games
              </h2>
              <hr />
              <ol>
                {data.sort(sortByGameStatus).map((game) => (
                  <li key={game._id}>
                    <NavLink
                      className={({ isActive }) =>
                        `block border-b p-4 text-xl ${
                          isActive ? "bg-white" : ""
                        }`
                      }
                      to={game._id}
                    >
                      🏰 {game.title} <StatusBadge status={game.status} />
                    </NavLink>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
