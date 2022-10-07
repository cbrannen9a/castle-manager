import { type Game } from "~/models/game.server";
import { type User } from "~/models/user.server";
import { StatusBadge } from "../Badge";
import PlayerCount from "../PlayerCount";
import PlayerId from "../PlayerId";

export default function GameDetails({
  title,
  status,
  maxPlayers,
  players,
  playerData,
  host,
  currentUser,
}: Pick<Game, "title" | "status" | "players" | "maxPlayers" | "host"> & {
  playerData?: Record<string, User> | null;
} & { currentUser: string }) {
  return (
    <>
      <h3 className="text-2xl font-bold">{title}</h3>
      <hr className="my-4" />
      <StatusBadge status={status} />
      <div className="pt-3 pb-4">
        <PlayerCount current={players?.length} max={maxPlayers} />
      </div>
      <h4 className="text-lg font-semibold">Players</h4>
      <hr className="my-2" />
      <ul className="mb-4 max-w-md list-inside space-y-1 divide-y divide-gray-200">
        {players?.map((player) => (
          <li key={player} className="py-3 sm:py-4">
            <PlayerId
              player={playerData?.[player]}
              isHost={player === host}
              isCurrentUser={player === currentUser}
            />
          </li>
        ))}
      </ul>
      <hr className="mb-8" />
    </>
  );
}
