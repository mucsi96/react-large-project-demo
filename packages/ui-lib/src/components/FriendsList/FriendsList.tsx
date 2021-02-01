import { useEffect } from 'react';
import React, { FC } from 'react';
import { getFriends } from 'friends-api';
import { useApi } from 'core';
import styles from './FriendsList.module.scss';
import { Button } from '../Button';

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
    <ul className={styles.container}>
      {friends.data.map(({ id, firstName, lastName, image }) => {
        const friend = [firstName, lastName].join(' ');
        return (
          <a
            key={id}
            data-name="name"
            href={`#${id}`}
            className={styles.friend}
          >
            <img src={image} alt={friend} />
            <span>{friend}</span>
            <div className={styles.actions}>
              <Button primary>Add to favourite</Button>
            </div>
          </a>
        );
      })}
    </ul>
  );
};
