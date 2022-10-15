import { type User } from "~/models/user.server";
import { Badge } from "../Badge";

export default function PlayerId({
  player,
  isHost,
  isCurrentUser,
  isCurrentUserHost,
  userIndex,
}: {
  player?: User;
  isHost: boolean;
  isCurrentUser: boolean;
  isCurrentUserHost: boolean;
  userIndex: number;
}) {
  return (
    <div className="flex items-center space-x-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{`${
          player?.email ?? "Refresh to load"
        } ${isCurrentUser ? "(You)" : ""} `}</p>
      </div>
      {isHost ? (
        <span>
          <Badge>Host</Badge>
        </span>
      ) : null}
      {isCurrentUserHost && !isHost ? (
        <button
          type="submit"
          name="intent"
          value={`removePlayer ${userIndex}`}
          className="my-2 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
