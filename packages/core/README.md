# Core

## API

### type Fetch

```ts
(url: string, options?: RequestInit) => Promise<Response>
```

### type Fetcher<A extends unknown[], T>

```ts
(fetch: Fetch, ...args: A) => Promise<T>
```

### type ApiErrorResponse

```ts
{
    error?: {
        message?: string;
    };
}
```

### type ApiError

```ts
{
    message: string;
    response?: ApiErrorResponse;
    status?: number;
}
```

### function toJSON<T>(responsePromise: Promise<Response>): Promise<T>;

Converts a native fetch Response promise to data Promise. Throws APIError based on not ok status.

Example

```ts
export function getFriends(fetch: Fetch): Promise<FriendsResponse> {
  return toJSON<FriendsResponse>(fetch('/api/friends'));
}

enum FriendActions {
  ADD_TO_FAVORITE = 'addToFavorite',
  REMOVE_FROM_FAVORITE = 'removeFromFavorite',
}

export async function processFriend(
  fetch: Fetch,
  friend: Friend,
  action: FriendActions
): Promise<void> {
  const { href, method = 'GET' } = friend._links[action];
  return toJSON<void>(fetch(href, { method }));
}
```

### type UseApiResult<A extends unknown[], T>

```ts
{
    fetch: (...args: A) => void;
    data?: T;
    error?: ApiError;
    isLoading: boolean;
    fetchArgs?: A;
}
```

### function useApi<A extends unknown[], T>(fetch: Fetch, fetcher: Fetcher<A, T>): UseApiResult<A, T>

Example:

```ts
function useFriends(fetch: Fetch) {
  const friends = useApi(fetch, getFriends);
  const processFriends = useApi(fetch, processFriend);

  useEffect(() => {
    friends.fetch();
  }, [friends]);

  return {
    friends: friends.data,
    isLoading: friends.isLoading,
    loadingErrorMessage: friends.error?.response,
    addToFavorites: (friend: Friend) => {
      processFriends.fetch(friend, FriendActions.ADD_TO_FAVORITE);
    },
  };
}
```
