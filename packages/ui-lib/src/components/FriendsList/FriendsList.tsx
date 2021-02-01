import { useEffect, useState } from 'react';
import React, { FC } from 'react';
import { Friend, FriendActions, getFriends, processFriend } from 'friends-api';
import { useApi } from 'core';
import styles from './FriendsList.module.scss';
import { Button } from '../Button';

export const FriendsList: FC = () => {
  const friends = useApi(getFriends);
  const processFriends = useApi(processFriend);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    friends.fetch();
  }, [friends]);

  useEffect(() => {
    if (friends.data) {
      setFavorites(
        friends.data.filter(({ isFavorite }) => isFavorite).map(({ id }) => id)
      );
    }
  }, [friends.data]);

  function addToFavorites(friend: Friend) {
    setFavorites([...favorites, friend.id]);
    processFriends.fetch(friend, FriendActions.ADD_TO_FAVORITE);
  }

  function removeFromFavorites(friend: Friend) {
    setFavorites(favorites.filter((id) => id !== friend.id));
    processFriends.fetch(friend, FriendActions.REMOVE_FROM_FAVORITE);
  }

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
      {friends.data.map((friend) => {
        const { id, firstName, lastName, image } = friend;
        const fullName = [firstName, lastName].join(' ');
        return (
          <div key={id} data-name="name" className={styles.friend}>
            <img src={image} alt={fullName} />
            <span>{fullName}</span>
            <div className={styles.actions}>
              {!favorites.includes(id) && (
                <Button primary onClick={() => addToFavorites(friend)}>
                  Add to favorite
                </Button>
              )}
              {favorites.includes(id) && (
                <Button secondary onClick={() => removeFromFavorites(friend)}>
                  Remove from favorite
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </ul>
  );
};
