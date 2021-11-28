import { ApiCaller, Button, FetchState, Spinner } from 'core';
import React, { FC } from 'react';
import styles from './FriendsList.module.css';
import { useFriends } from './useFriends';

export const FriendsList: FC<{ callApi: ApiCaller }> = ({ callApi }) => {
  const {
    friends,
    friendsResponse,
    searchText,
    loadMore,
    addToFavorites,
    removeFromFavorites,
    notifications,
    search,
    isFavorite,
    isProcessing,
  } = useFriends(callApi);

  return (
    <div data-testid="friend-list" className={styles.container}>
      <input
        type="text"
        value={searchText}
        onChange={(event) => search(event.target.value)}
      />
      {!!notifications.length && (
        <div data-testid="notifications" className={styles.notifications}>
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
          <div key={id} data-testid="friend" className={styles.friend}>
            {/* <img src={image} alt={fullName} /> */}
            <span data-testid="full-name">{fullName}</span>
            <div className={styles.actions}>
              {!isFavorite(friend) && (
                <Button
                  primary
                  onClick={() => addToFavorites(friend)}
                  disabled={isProcessing(friend)}
                >
                  Add to favorite
                </Button>
              )}
              {isFavorite(friend) && (
                <Button
                  secondary
                  onClick={() => removeFromFavorites(friend)}
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
        if (friendsResponse.fetchState === FetchState.LOADING) {
          return <Spinner />;
        }

        if (friendsResponse.error) {
          return (
            <span data-testid="message" className={styles.error}>
              {`${
                friendsResponse.error.response?.error?.message ?? ''
              } Status: ${friendsResponse.error.status ?? ''}`}
            </span>
          );
        }

        if (friends.length === 0) {
          return (
            <span data-testid="message" className={styles.info}>
              {'No friends found :('}
            </span>
          );
        }

        if (loadMore) {
          return (
            <div className={styles.loadMore}>
              <Button secondary onClick={loadMore}>
                Load more...
              </Button>
            </div>
          );
        }
      })()}
    </div>
  );
};
