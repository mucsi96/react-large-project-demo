export type MockMethod = "GET" | "POST" | "DELETE" | "PUT";

export type MockRequest = {
  url: string;
  method: MockMethod;
  headers: Record<string, string | string[]>;
  body?: unknown;
  params: Record<string, string | string[]>;
  query: Record<string, string | string[]>;
};

export type MockResponse = {
  status: (statusCode: number) => void;
  delay: (delayMs: number) => void;
  mockError: (enable: boolean) => void;
  mockHTML: (enable: boolean) => void;
};

export type Mock = {
  path: string;
  method?: MockMethod;
  callback: (
    req: MockRequest,
    res: MockResponse
  ) => Promise<unknown | undefined> | unknown | undefined;
};

export type MockWithRegexp = Mock & {
  regexp: RegExp;
  keys: string[];
};
