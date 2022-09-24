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
}: Pick<Game, "title" | "status" | "players" | "maxPlayers"> & {
  playerData?: Record<string, User> | null;
}) {
  return (
    <>
      <h3 className="text-2xl font-bold">{title}</h3>
      <hr className="my-4" />
      <StatusBadge status={status} />
      <div className="pt-3 pb-4">
        <PlayerCount current={players?.length} max={maxPlayers} />
      </div>
      <h3 className="text-lg font-semibold">Players:</h3>
      <ul className="my-4 max-w-md list-inside list-disc space-y-1">
        {players?.map((player) => (
          <li key={player}>
            <PlayerId player={playerData?.[player]} />
          </li>
        ))}
      </ul>
    </>
  );
}
