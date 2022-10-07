import { type User } from "~/models/user.server";
import { Badge } from "../Badge";

export default function PlayerId({
  player,
  isHost,
  isCurrentUser,
}: {
  player?: User;
  isHost: boolean;
  isCurrentUser: boolean;
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
    </div>
  );
}
