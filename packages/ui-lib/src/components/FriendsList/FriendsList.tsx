import React, { FC } from 'react';
import styles from './FriendsList.module.scss';
import { Button } from '../Button';
import { useFriends } from './useFriends';

export const FriendsList: FC = () => {
  const {
    isLoading,
    isEmpty,
    error,
    friends,
    loadMore,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
  } = useFriends();

  return (
    <ul className={styles.container}>
      {friends.map((friend) => {
        const { id, firstName, lastName, image } = friend;
        const fullName = [firstName, lastName].join(' ');
        return (
          <div key={id} data-name="friend" className={styles.friend}>
            <img src={image} alt={fullName} />
            <span>{fullName}</span>
            <div className={styles.actions}>
              {!isFavorite(friend) && (
                <Button
                  primary
                  onClick={() => addToFavorites(friend)}
                  data-name="add-to-favorite"
                >
                  Add to favorite
                </Button>
              )}
              {isFavorite(friend) && (
                <Button
                  secondary
                  onClick={() => removeFromFavorites(friend)}
                  data-name="remove-from-favorite"
                >
                  Remove from favorite
                </Button>
              )}
            </div>
          </div>
        );
      })}
      {(() => {
        if (error) {
          const message = `${error.response?.error?.message || ''}. Status: ${
            error.status || ''
          }`;
          return <span data-name="message">{message}</span>;
        }

        if (isLoading) {
          return (
            <Button secondary data-name="loading">
              Loading...
            </Button>
          );
        }

        if (loadMore) {
          return (
            <Button secondary onClick={loadMore} data-name="load-more">
              Load more...
            </Button>
          );
        }

        if (isEmpty) {
          return <span data-name="message">{'No friends found :('}</span>;
        }

        return null;
      })()}
    </ul>
  );
};
