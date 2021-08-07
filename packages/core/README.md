# Core

## API

### type CallApiOptions
```ts
{
  href: string;
  method?: ApiMethod;
  headers?: HeadersInit;
  signal?: AbortSignal | null;
  body?: unknown;
}
```

### type ApiCaller<ResponseBody = unknown>

```ts
(options?: CallApiOptions) => Promise<ResponseBody>
```

### type Fetcher<FetchArgs extends unknown[], ResponseBody>

```ts
(fetch: Fetch, ...args: FetchArgs) => Promise<ResponseBody>
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

### type UseApiResult<FetchArgs extends unknown[], ResponseBody>

```ts
{
    fetch: (...args: FetchArgs) => void;
    data?: ResponseBody;
    error?: ApiError;
    isLoading: boolean;
    fetchArgs?: FetchArgs;
}
```

### function useApi<FetchArgs extends unknown[], ResponseBody>(callApi: ApiCaller, fetcher: Fetcher<FetchArgs, ResponseBody>): UseApiResult<FetchArgs, ResponseBody>

Example:

```ts
function useFriends(callApi: ApiCaller) {
  const friends = useApi(callApi, getFriends);
  const processFriends = useApi(callApi, processFriend);

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
