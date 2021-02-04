import React, { FC } from 'react';
import styles from './FriendsList.module.scss';
import { Button } from '../Button';
import { useFriends } from './useFriends';
import { Spinner } from '../Spinner/Spinner';

export const FriendsList: FC = () => {
  const {
    isLoading,
    isEmpty,
    loadingErrorMessage,
    notifications,
    friends,
    loadMore,
    isFavorite,
    isProcessing,
    addToFavorites,
    removeFromFavorites,
  } = useFriends();

  return (
    <div className={styles.container}>
      <div data-name="notifications" className={styles.notifications}>
        {notifications.map(({ key, message }) => (
          <p key={key} className={styles.error}>
            {message}
          </p>
        ))}
      </div>
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
          return (
            <span data-name="message" className={styles.error}>
              {loadingErrorMessage}
            </span>
          );
        }

        if (isLoading) {
          return <Spinner />;
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

        if (isEmpty) {
          return (
            <span data-name="message" className={styles.info}>
              {'No friends found :('}
            </span>
          );
        }

        return null;
      })()}
    </div>
  );
};
