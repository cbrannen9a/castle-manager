import { client } from "~/lib";
import type { User } from "./user.server";

export type Game = {
  _id: string;
  title: string;
  players: string[];
  host: string;
};

export async function getGameListItems({ userId }: { userId: User["id"] }) {
  const data = await client.fetch(
    `*[_type == 'game' && host == $userId ]{...}`,
    {
      userId,
    }
  );

  return data;
}

export async function createGame({
  title,
  userId,
}: Pick<Game, "title"> & { userId: User["id"] }) {
  try {
    const data = await client.create({ _type: "game", title, host: userId });
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
    await client.delete(_id);
    return {};
  } catch (error) {
    return null;
  }
}

export async function getGame({
  _id,
  userId,
}: Pick<Game, "_id"> & { userId: User["id"] }) {
  try {
    const data = await client.fetch(
      `*[_type == 'game' && host == $userId && _id == $_id][0]{...}`,
      {
        _id,
        userId,
      }
    );
    return data;
  } catch (error) {
    return null;
  }
}
