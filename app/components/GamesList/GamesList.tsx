import { NavLink } from "react-router-dom";
import { sortByGameStatus } from "~/helpers";
import { type Game } from "~/models/game.server";
import { StatusBadge } from "../Badge";

export default function GamesList({ games }: { games: Game[] }) {
  return (
    <ol>
      {games.sort(sortByGameStatus).map((game) => (
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
  );
}
