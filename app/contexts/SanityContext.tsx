import { type ClientConfig } from "@sanity/client";
import { createContext, useContext, type ReactNode } from "react";

const SanityContext = createContext<ClientConfig | undefined>(undefined);

export function SanityContextProvider({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  children,
}: Props) {
  return (
    <SanityContext.Provider
      value={{
        apiVersion,
        dataset,
        projectId,
        useCdn,
      }}
    >
      {children}
    </SanityContext.Provider>
  );
}

export function useSanityContext(): ClientConfig {
  const context = useContext(SanityContext);
  if (context === undefined) {
    throw new Error(
      "useSanityContext must be rendered in a tree within a SanityContextProvider"
    );
  }
  return context;
}

interface Props extends ClientConfig {
  children: ReactNode;
}
