import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PROFILE_STORAGE_DIR } from '@/libs/config';
import { ensureAuthorized } from './utils/auth.util';
import type { NestRequest, NestResponse } from '../types/controller';

@Controller('api/serve')
export class ApiAssetsController {
  @Get('pfp/:file')
  async getProfileImage(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Param('file') file: string,
  ) {
    if (!(await ensureAuthorized(req, res))) {
      return;
    }

    const fileName = path.basename(file);

    if (!fileName.toLowerCase().endsWith('.webp')) {
      res.status(400).json({ message: 'File tidak valid.' });
      return;
    }

    const filePath = path.join(PROFILE_STORAGE_DIR, fileName);

    try {
      const imageBuffer = await readFile(filePath);

      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.status(200).send(imageBuffer);
    } catch {
      res.status(404).json({ message: 'Gambar tidak ditemukan.' });
    }
  }
}
