import React, { FC } from 'react';
import styles from './FriendsList.module.scss';
import { Button } from '../Button';
import { useFriends } from './useFriends';

export const FriendsList: FC = () => {
  const {
    isLoading,
    isEmpty,
    loadingErrorMessage,
    lastProcessingError,
    friends,
    loadMore,
    isFavorite,
    isProcessing,
    addToFavorites,
    removeFromFavorites,
  } = useFriends();

  return (
    <ul className={styles.container}>
      <span>{lastProcessingError}</span>
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
                  disabled={isProcessing(friend)}
                >
                  Add to favorite
                </Button>
              )}
              {isFavorite(friend) && (
                <Button
                  secondary
                  onClick={() => removeFromFavorites(friend)}
                  data-name="remove-from-favorite"
                  disabled={isProcessing(friend)}
                >
                  Remove from favorite
                </Button>
              )}
            </div>
          </div>
        );
      })}
      {(() => {
        if (loadingErrorMessage) {
          return <span data-name="message">{loadingErrorMessage}</span>;
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
