import { hasValidSession } from '@/controllers/auth/auth-session';
import type { NestRequest, NestResponse } from '../../types/controller';

export async function ensureAuthorized(req: NestRequest, res: NestResponse) {
  const authorized = await hasValidSession(req.headers as HeadersInit);

  if (!authorized) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }

  return true;
}
