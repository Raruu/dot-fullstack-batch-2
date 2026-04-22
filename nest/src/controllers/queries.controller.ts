import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { getRoomDetail } from '@/models/queries/rooms/get-room-detail';
import { getRoomListData } from '@/models/queries/rooms/get-room-list';
import { getUserListData } from '@/models/queries/users/get-user-list';
import { firstQueryValue } from './utils/query.util';
import type { NestRequest, NestResponse } from '../types/controller';

@Controller('api/queries')
export class QueriesController {
  @Get('rooms')
  async getRooms(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Query('floor') floor?: string | string[],
    @Query('search') search?: string | string[],
    @Query('page') page?: string | string[],
    @Query('pageSize') pageSize?: string | string[],
  ) {
    try {
      const data = await getRoomListData({
        floor: firstQueryValue(floor),
        search: firstQueryValue(search),
        page: firstQueryValue(page),
        pageSize: firstQueryValue(pageSize),
      });

      res.json(data);
    } catch {
      res.status(500).json({ message: 'Failed to get room list.' });
    }
  }

  @Get('rooms/:id')
  async getRoomById(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Param('id') id: string,
  ) {
    const roomId = Number(id);

    if (!Number.isInteger(roomId) || roomId <= 0) {
      res.status(400).json({ message: 'Invalid room id.' });
      return;
    }

    try {
      const data = await getRoomDetail(roomId);

      if (!data) {
        res.status(404).json({ message: 'Room not found.' });
        return;
      }

      res.json(data);
    } catch {
      res.status(500).json({ message: 'Failed to get room detail.' });
    }
  }

  @Get('users')
  async getUsers(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Query('status') status?: string | string[],
    @Query('search') search?: string | string[],
    @Query('page') page?: string | string[],
    @Query('pageSize') pageSize?: string | string[],
  ) {
    try {
      const data = await getUserListData({
        status: firstQueryValue(status),
        search: firstQueryValue(search),
        page: firstQueryValue(page),
        pageSize: firstQueryValue(pageSize),
      });

      res.json(data);
    } catch {
      res.status(500).json({ message: 'Failed to get user list.' });
    }
  }
}
