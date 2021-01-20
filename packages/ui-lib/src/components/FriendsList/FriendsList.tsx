import { useEffect } from 'react';
import { useState } from 'react';
import React, { FC } from 'react';
import { Friend, getFriends } from 'friends-api';

export const FriendsList: FC = () => {
  const [friends, setFriends] = useState<Friend[]>();

  useEffect(() => {
    getFriends()
      .then(setFriends)
      .catch((err) =>
        setFriends(() => {
          throw err;
        })
      );
  }, []);

  if (!friends) {
    return <span>{'Loading...'}</span>;
  }

  return (
    <ul>
      {friends.map(({ firstName, lastName }) => {
        const friend = [firstName, lastName].join(' ');
        return (
          <li key={friend} data-name="name">
            {friend}
          </li>
        );
      })}
    </ul>
  );
};
