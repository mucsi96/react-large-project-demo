export type MockMethod = "GET" | "POST" | "DELETE" | "PUT";

export type MockRequest = {
  url: string;
  method: MockMethod;
  headers: Record<string, string | string[]>;
  body: object;
  params: Record<string, string | string[]>;
  query: Record<string, string | string[]>;
};

export type MockResponse = {};

export type Mock = {
  path: string;
  method?: MockMethod;
  callback: (
    req: MockRequest,
    res: MockResponse
  ) => Promise<object | undefined> | object | undefined;
};

export type MockWithRegexp = Mock & {
  regexp: RegExp;
  keys: string[];
};
