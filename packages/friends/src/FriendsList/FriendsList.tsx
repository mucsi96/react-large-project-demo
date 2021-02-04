import { Button, Spinner } from 'core';
import React, { FC } from 'react';
import styles from './FriendsList.module.scss';
import { useFriends } from './useFriends';

export const FriendsList: FC = () => {
  const {
    friends = [],
    isLoading,
    loadingErrorMessage,
    loadMore,
  } = useFriends();

  return (
    <div className={styles.container}>
      {friends.map((friend) => {
        const { id, firstName, lastName, image } = friend;
        const fullName = [firstName, lastName].join(' ');
        return (
          <div key={id} data-name="friend" className={styles.friend}>
            <img src={image} alt={fullName} />
            <span>{fullName}</span>
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
