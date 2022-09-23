import { client } from "~/lib";
import type { User } from "./user.server";

export type Game = {
  _id: string;
  _rev: string;
  title: string;
  players?: string[];
  host: string;
  maxPlayers: number;
  status: GameStatus;
};

type GameStatus = "pending" | "inProgress" | "error" | "completed";

function isGame(uncertain: unknown): uncertain is Game {
  return (uncertain as Game)._id !== null;
}

export function getGameListItemsAsHostQuery({
  userId,
}: {
  userId: User["id"];
}) {
  return {
    query: `*[_type == 'game' && host == $userId ]{...}`,
    queryParams: {
      userId,
    },
  };
}

export async function getGameListItemsAsHost({
  userId,
}: {
  userId: User["id"];
}) {
  const { query, queryParams } = getGameListItemsAsHostQuery({ userId });
  const data: Game[] = await client.fetch(query, queryParams);

  return data;
}

export async function createGame({
  title,
  userId,
  maxPlayers,
}: Pick<Game, "title" | "maxPlayers"> & { userId: User["id"] }) {
  try {
    const data = await client.create({
      _type: "game",
      title,
      host: userId,
      maxPlayers,
      status: "pending",
    });
    if (!isGame(data)) {
      throw new Error("Invalid game data");
    }
    return data;
  } catch (error) {
    return null;
  }
}

export async function deleteGame({
  _id,
  userId,
}: Pick<Game, "_id"> & { userId: User["id"] }) {
  try {
    const game = await getGameAsHost({ _id, userId });
    if (!game) {
      throw new Error("Unable to delete game");
    }
    await client.delete(_id);
    return {};
  } catch (error) {
    return null;
  }
}

export async function startGame({
  _id,
  userId,
}: Pick<Game, "_id"> & { userId: User["id"] }) {
  try {
    await client.patch(_id).set({ status: "inProgress" }).commit();
    return {};
  } catch (error) {
    return null;
  }
}

export function getGameAsHostQuery({
  _id,
  userId,
}: Pick<Game, "_id"> & { userId: User["id"] }) {
  return {
    query: `*[_type == 'game' && host == $userId && _id == $_id][0]{...}`,
    queryParams: {
      _id,
      userId,
    },
  };
}

export async function getGameAsHost({
  _id,
  userId,
}: Pick<Game, "_id"> & { userId: User["id"] }) {
  const { query, queryParams } = getGameAsHostQuery({ _id, userId });
  try {
    const data: Game = await client.fetch(query, queryParams);
    return data;
  } catch (error) {
    return null;
  }
}

export function getGameListItemsQuery({ userId }: { userId: User["id"] }) {
  return {
    query: `*[_type == 'game' && $userId in players]{...}`,
    queryParams: {
      userId,
    },
  };
}

export async function getGameListItems({ userId }: { userId: User["id"] }) {
  const { query, queryParams } = getGameListItemsQuery({ userId });
  const data: Game[] = await client.fetch(query, queryParams);

  return data;
}

export function getGameQuery({ _id }: Pick<Game, "_id">) {
  return {
    query: `*[_type == 'game' && _id == $_id][0]{...}`,
    queryParams: {
      _id,
    },
  };
}

export async function getGame({ _id }: Pick<Game, "_id">) {
  const { query, queryParams } = getGameQuery({ _id });
  try {
    const data: Game = await client.fetch(query, queryParams);
    return data;
  } catch (error) {
    return null;
  }
}

export async function joinGameAsPlayer({
  _id,
  userId,
}: Pick<Game, "_id"> & { userId: User["id"] }) {
  try {
    await client
      .patch(_id)
      .setIfMissing({ players: [] })
      .insert("after", "players[-1]", [userId])
      .commit();
    return {};
  } catch (error) {
    return null;
  }
}
