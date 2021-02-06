import { Button, Spinner } from 'core';
import React, { FC } from 'react';
import styles from './FriendsList.module.scss';
import { useFriends } from './useFriends';

export const FriendsList: FC = () => {
  const {
    friends = [],
    isLoading,
    isEmpty,
    loadingErrorMessage,
    loadMore,
    addToFavorites,
    removeFromFavorites,
    notifications,
  } = useFriends();

  return (
    <div data-name="friend-list" className={styles.container}>
      {!!notifications.length && (
        <div data-name="notifications" className={styles.notifications}>
          {notifications.map(({ key, message }) => (
            <p key={key} className={styles.error}>
              {message}
            </p>
          ))}
        </div>
      )}
      {friends.map((friend) => {
        const { id, firstName, lastName, image } = friend;
        const fullName = [firstName, lastName].join(' ');
        return (
          <div key={id} data-name="friend" className={styles.friend}>
            <img src={image} alt={fullName} />
            <span data-name="full-name">{fullName}</span>
            <div className={styles.actions}>
              {!friend.isFavorite && (
                <Button
                  primary
                  onClick={() => addToFavorites(friend)}
                  data-name="add-to-favorite"
                  disabled={friend.isProcessing}
                >
                  Add to favorite
                </Button>
              )}
              {friend.isFavorite && (
                <Button
                  secondary
                  onClick={() => removeFromFavorites(friend)}
                  data-name="remove-from-favorite"
                  disabled={friend.isProcessing}
                >
                  Remove from favorite
                </Button>
              )}
            </div>
          </div>
        );
      })}
      {(() => {
        if (isLoading) {
          return <Spinner />;
        }

        if (loadingErrorMessage) {
          return (
            <span data-name="message" className={styles.error}>
              {loadingErrorMessage}
            </span>
          );
        }

        if (isEmpty) {
          return (
            <span data-name="message" className={styles.info}>
              {'No friends found :('}
            </span>
          );
        }

        if (loadMore) {
          return (
            <div className={styles.loadMore}>
              <Button secondary onClick={loadMore} data-name="load-more">
                Load more...
              </Button>
            </div>
          );
        }
      })()}
    </div>
  );
};
