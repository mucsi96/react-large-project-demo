import { Mock, MockMethod } from "./types";
import { findMatchingMock, createMockResponse } from "./utils";

let mocks: Mock[] = [];
let serviceWorkerRegistered = false;

export function registerApiMocks(newMocks: Mock[]): void {
  mocks = [...mocks, ...newMocks];

  if (!serviceWorkerRegistered) {
    serviceWorkerRegistered = true;
    navigator.serviceWorker
      .register(`mockApiServiceWorker.js`, { scope: "./" })
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
  }
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
