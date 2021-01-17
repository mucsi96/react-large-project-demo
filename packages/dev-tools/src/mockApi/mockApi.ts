import { Mock, MockMethod, MockWithRegexp } from "./types";
import { findMatchingMock, getParams, getQuery } from "./utils";

let mocks: Mock[] = [];

export async function enableMockApi() {
  const mockApiServiceWorker = require("file-loader!dev-tools/lib/mockApi/mockApiServiceWorker")
    .default;

  navigator.serviceWorker
    .register(mockApiServiceWorker, { scope: "./" })
    .catch((err) => console.error("error registering sw", err));

  window.addEventListener("beforeunload", () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLIENT_CLOSED",
      });
    }
  });

  navigator.serviceWorker.onmessage = async ({ data, ports }) => {
    if (data && data.type === "REQUEST") {
      handleRequest({ ...data.request, port: ports[0], mocks });
    }
  };

  await navigator.serviceWorker.ready;
}

export function registerApiMocks(newMocks: Mock[]): void {
  mocks = [...mocks, ...newMocks];
}

async function handleRequest({
  url: fullUrl,
  method,
  body,
  headers,
  port,
  mocks,
}: {
  url: string;
  method: MockMethod;
  body: string;
  headers: Record<string, string | string[]>;
  port: MessagePort;
  mocks: Mock[];
}) {
  const url = new URL(fullUrl);
  const { match, mock } = findMatchingMock(mocks, url, method);

  if (!match || !mock) {
    return port.postMessage({
      type: "MOCK_NOT_FOUND",
    });
  }

  const response = await createMockResponse({
    mock,
    match,
    method,
    headers,
    url,
    body,
  });

  port.postMessage({
    response,
    type: "MOCK_SUCCESS",
  });
}

export async function createMockResponse({
  mock,
  match,
  url,
  method,
  body,
  headers,
}: {
  mock: MockWithRegexp;
  match: RegExpExecArray;
  url: URL;
  method: MockMethod;
  body: string;
  headers: Record<string, string | string[]>;
}) {
  let status = 200;
  let delay: number | undefined;
  let mockError = false;
  let mockHTML = false;
  let responseBody = await mock.callback(
    {
      url: url.pathname,
      method,
      headers,
      body: body && JSON.parse(body),
      params: getParams(match, mock),
      query: getQuery(url.searchParams),
    },
    {
      status(statusCode: number) {
        status = statusCode;
      },
      delay(delayMs: number) {
        delay = delayMs;
      },
      mockError(enable: boolean) {
        mockError = enable;
      },
      mockHTML(enable: boolean) {
        mockHTML = enable;
      },
    }
  );

  if (mockError) {
    responseBody = {
      error: { message: "We couldn't process your request at this time" },
    };
  }

  if (delay) {
    await new Promise((resolve) => window.setTimeout(resolve, delay));
  }

  return {
    body: mockHTML
      ? "<html></html>"
      : responseBody && JSON.stringify(responseBody),
    status: mockError ? 500 : status,
  };
}
