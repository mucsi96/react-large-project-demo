import { useEffect } from "react";
import { useState } from "react";
import React, { FC } from "react";

async function loadFriends(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
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

  if (!friends) {
    return <span>{"Loading..."}</span>;
  }

  return (
    <ul>
      {friends.map((friend) => (
        <li key={friend} data-name="name">
          {friend}
        </li>
      ))}
    </ul>
  );
};
