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

  const payload: Record<string, unknown> = {};
  const uniqueKeys = new Set(formData.keys());

  for (const key of uniqueKeys) {
    const values = formData.getAll(key);

    if (key === "slotNumbers") {
      payload[key] = values;
    } else {
      payload[key] = values.length === 1 ? values[0] : values;
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
    method,
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return res;
}
