import { type User } from "~/models/user.server";

export default function PlayerId({ player }: { player?: User }) {
  return <div>{player?.email ?? "Refresh to load"}</div>;
}
