import { useEffect } from "react";
import { useState } from "react";
import React, { FC } from "react";

async function loadFriends(): Promise<string[]> {
  const response = await fetch("/friends");
  return (await response.json()) as string[];
}

export const FriendsList: FC = () => {
  const [friends, setFriends] = useState<string[]>();

  useEffect(() => {
    loadFriends()
      .then(setFriends)
      .catch((err) =>
        setFriends(() => {
          throw err;
        })
      );
  }, []);

  return (
    <ul>
      {friends?.map((friend) => (
        <ul key={friend}>{friend}</ul>
      ))}
    </ul>
  );
};
