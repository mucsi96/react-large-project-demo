import { useEffect } from 'react';
import React, { FC } from 'react';
import { getFriends } from 'friends-api';
import { useApi } from 'core';

export const FriendsList: FC = () => {
  const friends = useApi(getFriends);

  useEffect(() => {
    friends.fetch();
  }, [friends]);

  if (friends.error) {
    const message = `${friends.error.response?.error?.message || ''}. Status: ${
      friends.error.status || ''
    }`;
    return <span>{message}</span>;
  }

  if (friends.isLoading) {
    return <span>{'Loading...'}</span>;
  }

  if (!friends.data?.length) {
    return <span>{'No friends found :('}</span>;
  }

  return (
    <ul>
      {friends.data.map(({ firstName, lastName }) => {
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
