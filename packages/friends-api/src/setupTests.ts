import { setupServer } from 'msw/node';
import { mockFriendHandlers } from './mocks/handlers';

export const server = setupServer(...mockFriendHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
