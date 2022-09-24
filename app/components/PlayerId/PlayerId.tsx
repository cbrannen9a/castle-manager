import { type User } from "~/models/user.server";

export default function PlayerId({ player }: { player?: User }) {
  return <span className="truncate">{player?.email ?? "Refresh to load"}</span>;
}
