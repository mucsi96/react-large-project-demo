let mockSwitches: Record<string, string> = {};

export function setMockSwitch(switchName: string, value: string): void {
  mockSwitches[switchName] = value;
}

export function getMockSwitch(switchName: string): string {
  const searchParams = new URLSearchParams(window.location.search);

  return (
    searchParams
      .getAll('mock')
      .map((value) => value.split('--'))
      .find(([name]) => name === switchName)?.[1] ?? mockSwitches[switchName]
  );
}

export function clearMockSwitches(): void {
  mockSwitches = {};
}

export function saveInMockDB<T>(key: string, value: T): void {
  const storage = JSON.parse(
    sessionStorage.getItem('mock-api-db') || '{}'
  ) as Record<string, T>;

  sessionStorage.setItem(
    'mock-api-db',
    JSON.stringify({ ...storage, [key]: value })
  );
}

export function loadFromMockDB<T>(key: string): T {
  const storage = JSON.parse(
    sessionStorage.getItem('mock-api-db') || '{}'
  ) as Record<string, T>;

  return storage[key];
}

export function clearMockDB(): void {
  sessionStorage.removeItem('mock-api-db');
}

export function setMockApiDelay(delay: number): void {
  setMockSwitch('global-delay', delay.toString());
}

export function getMockApiDelay(): number {
  return parseInt(getMockSwitch('global-delay') ?? '0');
}
