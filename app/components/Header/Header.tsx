import { Form, Link } from "@remix-run/react";
import { useUser } from "~/utils";

export default function Header() {
  const user = useUser();
  return (
    <header className="flex w-full items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to=".">Games</Link>
      </h1>
      <p className="hidden sm:flex">{user.email}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
}
