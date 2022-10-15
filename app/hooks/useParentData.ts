import { useMatches } from "@remix-run/react";

export function useParentData<T>(pathname: string): T | null {
  const matches = useMatches();
  const parentMatch = matches.find((match) => match.id === pathname);
  if (!parentMatch) return null;
  return parentMatch.data as T;
}
