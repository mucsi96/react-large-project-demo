import { registerApiMocks } from 'dev-tools';

export function setupApiMocks(): void {
  registerApiMocks([
    {
      path: '/friends',
      callback: () => ['Tom', 'John', 'Alex'],
    },
  ]);
}
