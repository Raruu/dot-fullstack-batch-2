import { NextResponse } from "next/server";
import { getUnauthorizedIfNoSession } from "@/controllers/auth/auth-session";
import { JsonValue, ActionHandler } from "@/types/api-actions";

function appendFormValue(formData: FormData, key: string, value: JsonValue) {
  if (value === null) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      appendFormValue(formData, key, item);
    }

    return;
  }

  if (typeof value === "object") {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, String(value));
}

async function getRequestFormData(request: Request): Promise<FormData> {
  const contentType = request.headers.get("content-type") ?? "";

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    return request.formData();
  }

  const payload = (await request.json().catch(() => null)) as JsonValue;
  const formData = new FormData();

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    for (const [key, value] of Object.entries(payload)) {
      appendFormValue(formData, key, value);
    }
  }

  return formData;
}

function getRevalidateTarget(
  formData: FormData,
  defaultRevalidateTarget: string,
): string {
  const revalidateTarget = String(
    formData.get("revalidateTarget") ?? defaultRevalidateTarget,
  ).trim();

  return revalidateTarget || defaultRevalidateTarget;
}

async function ensureAuthorized() {
  const unauthorizedResponse = await getUnauthorizedIfNoSession();

  if (unauthorizedResponse !== true) {
    return unauthorizedResponse;
  }

  return null;
}

export async function handleActionRequest(
  request: Request,
  action: ActionHandler,
  defaultRevalidateTarget: string,
  fallbackMessage: string,
) {
  const unauthorizedResponse = await ensureAuthorized();

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const formData = await getRequestFormData(request);
    const revalidateTarget = getRevalidateTarget(
      formData,
      defaultRevalidateTarget,
    );
    const result = await action(revalidateTarget, {}, formData);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { success: false, message: fallbackMessage },
      { status: 500 },
    );
  }
}
