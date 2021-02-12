# Mock API

## API

### type MockMethod

```ts
'GET' | 'POST' | 'DELETE' | 'PUT';
```

### type MockRequest

```ts
{
    url: string;
    method: MockMethod;
    headers: Record<string, string | string[]>;
    body?: unknown;
    params: Record<string, string>;
    query: Record<string, string | string[]>;
}
```

### type MockResponse

```ts
{
    status: (statusCode: number) => void;
    delay: (delayMs: number) => void;
    mockError: (enable: boolean) => void;
    mockHTML: (enable: boolean) => void;
}
```

### type Mock

```ts
{
    path: string;
    method?: MockMethod;
    callback: (req: MockRequest, res: MockResponse) => Promise<unknown | undefined> | unknown | undefined;
}
```

### enableNodeMockApi() => void

Used internally by `dev-tools` Jest configuration

### enableSwMockApi() => Promise<void>

Used internally by `WaitForMockApi` Storybook configuration and manually in application index.ts

### registerApiMocks(newMocks: Mock[]) => void

Example

```ts
export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/api/friends',
      callback: getFriends,
    },
    {
      path: '/api/friends/:id/add-to-favorite',
      method: 'POST',
      callback: addToFavorite,
    },
    {
      path: '/api/friends/:id/remove-from-favorite',
      method: 'POST',
      callback: removeFromFavorite,
    },
  ]);
}
```

### setMockSwitch(switchName: string, value: string) => void

Switches a mock switch. Wrapper function is normally used in storybook stories and tests

Example

```ts
export enum FriendsMockSwitch {
  NORMAL = 'NORMAL',
  EMPTY = 'EMPTY',
  SLOW = 'SLOW',
  LOADING_FAILURE = 'LOADING_FAILURE',
  PROCESSING_FAILURE = 'PROCESSING_FAILURE',
}

export function setFriendsMockSwitch(mockSwitch: FriendsMockSwitch): void {
  setMockSwitch('friends', mockSwitch);
}

export function getFriendsMockSwitck(): FriendsMockSwitch {
  return getMockSwitch('friends') as FriendsMockSwitch;
}
```

### getMockSwitch(switchName: string) => string;

Wrapper function is normally used in API mock callbacks

### clearMockSwitches() => void;

Used internally in `dev-tools` Jest configuration as `beforeEach`

### saveInMockDB<T>(key: string, value: T) => void;

Basic key, value pair storage. Persist a value in mock "backend". Based on `SessionStorage`.
Used in API mock callbacks

Example

```ts
function getFavorites(): string[] {
  return loadFromMockDB('friend-favories') ?? ['enrico', 'michelle'];
}

function setFavorites(favorites: string[]): void {
  saveInMockDB('friend-favories', favorites);
}

function addToFavorite({ params }: MockRequest, response: MockResponse) {
  setFavorites([...getFavorites(), params.id]);
}
```

### loadFromMockDB<T>(key: string) => T;

Retrieve value from key, value pair storage

### clearMockDB() => void;

Clear key, value storage.
Used internally in `dev-tools` Jest configuration as `beforeEach`

### setMockApiDelay(delay: number) => void;

Set a global delay to calls. Usefull for simulating real UX.
Used internally in Storybook configuration manually in application index.ts

### WaitForMockApi: FC;

Delays the rendering of children until the service worker is ready to handle requests.
Used internally in Storybook configuration manually in application index.ts

## Flow

1. Register service worker
