import {
  type MutationEvent,
  type ListenEvent,
  type Mutation,
  type SanityDocumentStub,
  type IdentifiedSanityDocumentStub,
  type PatchOperations,
} from "@sanity/client";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import useSanityClient from "./useSanityClient";

function isMutation(
  updateEvent: ListenEvent<Record<string, any>>
): updateEvent is MutationEvent {
  return updateEvent.type === "mutation";
}

function handleUpdate<T extends { _id: string; _rev: string }>(
  updateEvent: ListenEvent<Record<string, any>>,
  setData:
    | Dispatch<SetStateAction<T | null>>
    | Dispatch<SetStateAction<T[] | null>>
) {
  if (isMutation(updateEvent)) {
    updateEvent.mutations.forEach((mutation) => {
      handleMutation(updateEvent, mutation, setData);
    });
  }
}

function isCreateMutation<R extends Record<string, any>>(
  mutation: Mutation<Record<string, any>>
): mutation is { create: SanityDocumentStub<R> } {
  return typeof mutation === "object" && "create" in mutation;
}

function isDeleteMutation(
  mutation: Mutation<Record<string, any>>
): mutation is { delete: { id: string } } {
  return typeof mutation === "object" && "delete" in mutation;
}

function isCreateOrReplaceMutation<R extends Record<string, any>>(
  mutation: Mutation<Record<string, any>>
): mutation is { createOrReplace: IdentifiedSanityDocumentStub<R> } {
  return typeof mutation === "object" && "createOrReplace" in mutation;
}

function isPatchMutation(
  mutation: Mutation<Record<string, any>>
): mutation is { patch: PatchOperations & { id: string } } {
  return (
    typeof mutation === "object" &&
    "patch" in mutation &&
    "id" in mutation.patch
  );
}

// export type InsertPatch =
//   | { before: string; items: any[] }
//   | { after: string; items: any[] }
//   | { replace: string; items: any[] };

// // Note: this is actually incorrect/invalid, but implemented as-is for backwards compatibility
// export interface PatchOperations {
//   set?: { [key: string]: any };
//   setIfMissing?: { [key: string]: any };
//   diffMatchPatch?: { [key: string]: any };
//   unset?: string[];
//   inc?: { [key: string]: number };
//   dec?: { [key: string]: number };
//   insert?: InsertPatch;
//   ifRevisionID?: string;
// }

function handlePatch<
  T extends Record<string, unknown> & { _id: string; _rev: string }
>(toPatch: T, operation: PatchOperations) {
  if (operation.ifRevisionID && operation.ifRevisionID !== toPatch._rev) {
    return toPatch;
  }
  let patched = toPatch;
  if (operation.set) {
    patched = { ...patched, ...operation.set };
  }

  if (operation.setIfMissing) {
    patched = { ...patched, ...operation.setIfMissing };
  }

  if (operation.unset) {
    operation.unset.forEach((key) => {
      if (patched[key]) {
        delete patched[key];
      }
    });
  }

  return patched;
}

function shouldPatch<
  T extends Record<string, unknown> & { _id: string; _rev: string }
>(toPatch: T, operation: PatchOperations) {
  if (
    !operation.ifRevisionID ||
    (operation.ifRevisionID && operation.ifRevisionID === toPatch._rev)
  ) {
    return true;
  }
  return false;
}

function handleMutation<T extends { _id: string; _rev: string }>(
  updateEvent: MutationEvent<Record<string, any>>,
  mutation: Mutation<Record<string, any>>,
  setData:
    | Dispatch<SetStateAction<T | null>>
    | Dispatch<SetStateAction<T[] | null>>
) {
  if (isCreateMutation(mutation)) {
    setData((previous: T | T[] | null) => {
      if (Array.isArray(previous)) {
        return [...previous, updateEvent.result as T];
      }

      return updateEvent.result as T;
    });
  }
  if (isDeleteMutation(mutation)) {
    setData((previous: T | T[] | null) => {
      if (Array.isArray(previous)) {
        const newArr = previous.filter((i) => i._id !== mutation.delete.id);
        return newArr;
      }

      return null;
    });
  }
  if (isPatchMutation(mutation)) {
    setData((previous: T | T[] | null) => {
      if (Array.isArray(previous)) {
        const toPatchedItem = previous.find((i) => i._id === mutation.patch.id);

        if (toPatchedItem && shouldPatch(toPatchedItem, mutation.patch)) {
          const patchIndex = previous.indexOf(toPatchedItem);

          const patchedItem = handlePatch(toPatchedItem, mutation.patch);

          const newArr = previous.filter((i) => i._id !== mutation.patch.id);
          newArr.splice(patchIndex, 0, patchedItem);

          return newArr;
        }
        return previous;
      }

      return updateEvent.result as T;
    });
  }

  if (isCreateOrReplaceMutation(mutation)) {
    setData((previous: T | T[] | null) => {
      if (Array.isArray(previous)) {
        const newArr = previous.filter(
          (i) => i._id !== mutation.createOrReplace._id
        );
        return [...newArr, updateEvent.result as T];
      }

      return updateEvent.result as T;
    });
  }
}

export function useSubscriptionToList<T extends { _id: string; _rev: string }>({
  query,
  queryParams,
  initialData,
}: {
  query: string;
  queryParams: Record<string, unknown>;
  initialData: T[];
}) {
  const [data, setData] = useState<T[] | null>(initialData);
  const client = useSanityClient();

  useEffect(() => {
    const subscription = client
      .listen(query, queryParams, { visibility: "query" })
      .subscribe((update) => {
        handleUpdate(update, setData);
      });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [query, queryParams, client]);
  return { data };
}

export function useSubscription<T extends { _id: string; _rev: string }>({
  query,
  queryParams,
  initialData,
}: {
  query: string;
  queryParams: Record<string, unknown>;
  initialData: T | null;
}) {
  const [data, setData] = useState<T | null>(initialData);
  const client = useSanityClient();

  useEffect(() => {
    setData(initialData);
    const subscription = client
      .listen(query, queryParams, { visibility: "query" })
      .subscribe((update) => {
        handleUpdate(update, setData);
      });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [query, queryParams, client, initialData]);
  return { data };
}
