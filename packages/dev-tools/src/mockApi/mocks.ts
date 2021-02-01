import { Mock } from './types';

let mocks: Mock[] = [];
let mockSwitches = getInitialMockSwitches();
const hasInitialMockSwitches = !!Object.keys(mockSwitches).length;

export function registerApiMocks(newMocks: Mock[]): void {
  mocks = [...mocks, ...newMocks];
}

export function getMocks(): Mock[] {
  return mocks;
}

function getInitialMockSwitches(): Record<string, string> {
  const searchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    [...searchParams.entries()]
      .filter(([name]) => name === 'mock')
      .map(([, value]) => value.split('--'))
  ) as Record<string, string>;
}

export function setMockSwitch(name: string, value: string): void {
  if (hasInitialMockSwitches) {
    return;
  }

  mockSwitches[name] = value;
}

export function getMockSwitch(name: string): string {
  return mockSwitches[name];
}

export function clearMockSwitches(): void {
  mockSwitches = {};
}

export function saveInMockStorage<T>(key: string, value: T): void {
  const storage = JSON.parse(
    sessionStorage.getItem('mock-api-storage') || '{}'
  ) as Record<string, T>;

  sessionStorage.setItem(
    'mock-api-storage',
    JSON.stringify({ ...storage, [key]: value })
  );
}

export function getFromMockStorage<T>(key: string): T {
  const storage = JSON.parse(
    sessionStorage.getItem('mock-api-storage') || '{}'
  ) as Record<string, T>;

  return storage[key];
}

export function clearMockStorage(): void {
  sessionStorage.removeItem('mock-api-storage');
}
