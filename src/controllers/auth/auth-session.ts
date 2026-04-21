import { auth } from './auth';

function toHeaders(input?: HeadersInit): Headers {
  if (!input) {
    return new Headers();
  }

  return new Headers(input);
}

export async function getSession(headersInit?: HeadersInit) {
  const resolvedHeaders = toHeaders(headersInit);

  const session = await auth.api.getSession({
    headers: resolvedHeaders,
  });

  return session;
}

export async function hasValidSession(headersInit?: HeadersInit) {
  const session = await getSession(headersInit);

  return Boolean(session?.session && session?.user);
}

export async function getUnauthorizedIfNoSession(headersInit?: HeadersInit) {
  if (await hasValidSession(headersInit)) {
    return true;
  }

  return { message: 'Unauthorized', status: 401 };
}
