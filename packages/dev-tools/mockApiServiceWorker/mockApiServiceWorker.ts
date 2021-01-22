/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
// eslint-disable-next-line no-restricted-globals
const sw = (self as unknown) as ServiceWorkerGlobalScope;

sw.addEventListener('install', () => {
  sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim());
});

sw.addEventListener('fetch', (event) => {
  const { request, clientId } = event;
  const url = new URL(request.url);

  console.log('fetch', url.pathname);

  if (!clientId || !url.pathname.startsWith('/api/')) {
    return;
  }

  return event.respondWith(createResponse(clientId, request));
});

sw.setInterval(async () => {
  const clients = await sw.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  });

  if (!clients || !clients.length) {
    sw.registration.unregister();
  } else {
    clients.forEach((client) => sendToClient(client, { type: 'READY' }));
  }
}, 500);

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
    type: 'REQUEST',
    request: {
      url,
      method,
      body,
      headers,
    },
  });

  if (type !== 'MOCK_SUCCESS') {
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

export {};
