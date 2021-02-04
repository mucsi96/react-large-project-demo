import { useApi } from 'core';
import { Friend, getFriends } from 'friends-api';
import { useEffect } from 'react';

export function useFriends(): {
  friends?: Friend[];
  isLoading: boolean;
} {
  const friends = useApi(getFriends);

  useEffect(() => {
    friends.fetch();
  }, [friends]);

  return {
    friends: friends.data,
    isLoading: friends.isLoading,
  };
}
