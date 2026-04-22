import type {
  ActionFn,
  NestRequest,
  NestResponse,
  UploadedFile,
} from '../../types/controller';

function appendFormValue(formData: FormData, key: string, value: unknown) {
  if (value === null || value === undefined) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      appendFormValue(formData, key, item);
    }

    return;
  }

  if (typeof value === 'object') {
    formData.append(key, JSON.stringify(value));
    return;
  }

  formData.append(key, String(value));
}

function toFormData(body: Record<string, unknown>, files: UploadedFile[] = []) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(body)) {
    appendFormValue(formData, key, value);
  }

  for (const file of files) {
    const upload = new File([new Uint8Array(file.buffer)], file.originalname, {
      type: file.mimetype,
      lastModified: Date.now(),
    });

    formData.append(file.fieldname, upload);
  }

  return formData;
}

export async function runActionRequest(
  req: NestRequest,
  res: NestResponse,
  action: ActionFn,
  fallbackMessage: string,
  files: UploadedFile[] = [],
) {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const formData = toFormData(body as Record<string, unknown>, files);
    const target = String(formData.get('revalidateTarget')).trim();

    const result = await action(target, {}, formData);

    res.status(result.success ? 200 : 400).json(result);
  } catch {
    res.status(500).json({ success: false, message: fallbackMessage });
  }
}
