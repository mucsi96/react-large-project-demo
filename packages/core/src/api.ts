import { ajax } from 'rxjs/ajax';

export async function fetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const { url, method, body, headers } =
    input instanceof Request ? input : new Request(input, init);
  const result = await ajax({
    url,
    method,
    body,
    headers,
  }).toPromise();

  if (result.responseType === 'json') {
    const blob = new Blob([JSON.stringify(result.response)], {
      type: 'application/json',
    });

    return new Response(blob, { status: result.status });
  }

  return new Response();
}
