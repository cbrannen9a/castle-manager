import { type GameStatus } from "~/models/game.server";
import Badge, { type BadgeType } from "./Badge";

function statusToBadgeType(status: GameStatus): {
  type: BadgeType;
  label: string;
} {
  switch (status) {
    case "inProgress":
      return {
        type: "primary",
        label: "In Progress",
      };
    case "completed":
      return {
        type: "success",
        label: "Completed",
      };
    case "error":
      return {
        type: "danger",
        label: "Error",
      };
    case "pending":
      return {
        type: "warning",
        label: "Pending",
      };
    default:
      return { type: "danger", label: "Unknown" };
  }
}

export default function StatusBadge({ status }: { status: GameStatus }) {
  const { label, type } = statusToBadgeType(status);
  return <Badge type={type}>{label}</Badge>;
}
