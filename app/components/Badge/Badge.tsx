import { type ReactNode } from "react";

export type BadgeType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

function getBadgeColor(badgeType?: BadgeType): string {
  switch (badgeType) {
    case "danger":
      return "bg-red-600";
    case "info":
      return "bg-blue-400";
    case "secondary":
      return "bg-purple-600";
    case "success":
      return "bg-green-500";
    case "warning":
      return "bg-yellow-500";

    case "primary":
    default:
      return "bg-blue-500";
  }
}

export default function Badge({
  type,
  children,
}: {
  type?: BadgeType;
  children: ReactNode;
}) {
  return (
    <span
      className={`${getBadgeColor(
        type
      )} inline-block whitespace-nowrap rounded-full py-1 px-2.5 text-center align-baseline text-xs font-bold leading-none text-white`}
    >
      {children}
    </span>
  );
}
