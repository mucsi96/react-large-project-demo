/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
// eslint-disable-next-line no-restricted-globals
const sw = (self as unknown) as ServiceWorkerGlobalScope;

sw.addEventListener("install", () => {
  sw.skipWaiting();
});

sw.addEventListener("activate", (event) => {
  event.waitUntil(sw.clients.claim());
});

sw.addEventListener("fetch", (event) => {
  const { request, clientId } = event;
  const { destination, cache, mode } = request;

  if (
    !clientId ||
    destination ||
    (cache === "only-if-cached" && mode !== "same-origin")
  ) {
    return;
  }

  return event.respondWith(createResponse(clientId, request));
});

sw.addEventListener(
  "message",
  async ({ data }: { data?: { type: string } }) => {
    if (data && data.type === "CLIENT_CLOSED") {
      const clients = await sw.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });

      if (!clients || !clients.length || clients.length === 1) {
        sw.registration.unregister();
      }
    }
  }
);

function sendToClient(
  client: Client,
  message: unknown
): Promise<{ type: string; response: { body: string; status: number } }> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => resolve(event.data);

    client.postMessage(message, [channel.port2]);
  });
}

async function createResponse(clientId: string, request: Request) {
  const getOriginalResponse = () => fetch(request);
  const client = await sw.clients.get(clientId);

  if (!client) {
    return getOriginalResponse();
  }

  const { url, method } = request;
  const body = await request.text();
  const headers = getHeaders(request);

  const { type, response } = await sendToClient(client, {
    type: "REQUEST",
    request: {
      url,
      method,
      body,
      headers,
    },
  });

  if (type !== "MOCK_SUCCESS") {
    return getOriginalResponse();
  }

  return new Response(response.body, { status: response.status });
}

function getHeaders(request: Request) {
  const headers = {} as Record<string, string | string[]>;

  request.headers.forEach((value, name) => {
    if (Array.isArray(headers[name])) {
      headers[name] = [...headers[name], value];
      return;
    }

    if (headers[name]) {
      headers[name] = [headers[name] as string, value];
      return;
    }

    headers[name] = value;
  });
  return headers;
}
