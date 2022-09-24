import { type GameStatus, type Game } from "~/models/game.server";

const statusOrder: Record<GameStatus, number> = {
  inProgress: 1,
  pending: 2,
  completed: 3,
  error: 4,
};

export function sortByGameStatus(a: Game, b: Game) {
  return statusOrder[a.status] - statusOrder[b.status];
}
