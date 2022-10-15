import { NavLink } from "@remix-run/react";

export default function JoinOrCreate() {
  const activeStyle = {
    border: "1px solid rgb(59 130 246 / var(--tw-bg-opacity))",
    backgroundColor: "white",
    color: "rgb(59 130 246 / var(--tw-bg-opacity))",
  };
  return (
    <div className="flex w-full items-center justify-around border-b p-4">
      <NavLink
        to="/games"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Join
      </NavLink>
      <NavLink
        to="/create"
        style={({ isActive }) => (isActive ? activeStyle : undefined)}
        className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
      >
        Host
      </NavLink>
    </div>
  );
}
