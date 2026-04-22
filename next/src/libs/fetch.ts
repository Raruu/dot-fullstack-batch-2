export async function swrFetcher(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  return res.json();
}

export async function fetcherJson(
  url: string,
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  formData: FormData,
  options: RequestInit = {},
) {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const payload = Object.fromEntries(formData.entries());

  const res = await fetch(url, {
    ...options,
    headers,
    method,
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return res;
}
