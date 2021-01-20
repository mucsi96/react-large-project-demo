import { useEffect } from 'react';
import { useState } from 'react';
import React, { FC } from 'react';
import { Friend, getFriends } from 'friends-api';

export const FriendsList: FC = () => {
  const [error, setError] = useState(false);
  const [friends, setFriends] = useState<Friend[]>();

  useEffect(() => {
    getFriends().then(setFriends).catch(setError);
  }, []);

  if (error) {
    return <span>{'Failed to load friends'}</span>;
  }

  if (!friends) {
    return <span>{'Loading...'}</span>;
  }

  if (!friends.length) {
    return <span>{'No friends found :('}</span>;
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
