/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { createRoomAction } from '@/controllers/actions/rooms/create';
import { deleteRoomAction } from '@/controllers/actions/rooms/delete';
import { updateRoomAction } from '@/controllers/actions/rooms/update';
import { createScheduleAction } from '@/controllers/actions/schedule/create';
import { deleteScheduleAction } from '@/controllers/actions/schedule/delete';
import { updateScheduleAction } from '@/controllers/actions/schedule/update';
import { createUserAction } from '@/controllers/actions/users/create';
import { deleteUserAction } from '@/controllers/actions/users/delete';
import { updateUserAction } from '@/controllers/actions/users/update';
import { runActionRequest } from './utils/action.util';
import type {
  ActionFn,
  NestRequest,
  NestResponse,
  UploadedFile,
} from '../types/controller';

@Controller('api/actions')
export class ApiActionsController {
  @Post('rooms')
  async createRoom(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    await runActionRequest(
      req,
      res,
      createRoomAction as ActionFn,
      'Failed to create room.',
    );
  }

  @Put('rooms')
  async updateRoom(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    await runActionRequest(
      req,
      res,
      updateRoomAction as ActionFn,
      'Failed to update room.',
    );
  }

  @Delete('rooms')
  async deleteRoom(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    await runActionRequest(
      req,
      res,
      deleteRoomAction as ActionFn,
      'Failed to delete room.',
    );
  }

  @Post('schedule')
  async createSchedule(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    await runActionRequest(
      req,
      res,
      createScheduleAction as ActionFn,
      'Failed to create schedule.',
    );
  }

  @Put('schedule')
  async updateSchedule(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    await runActionRequest(
      req,
      res,
      updateScheduleAction as ActionFn,
      'Failed to update schedule.',
    );
  }

  @Delete('schedule')
  async deleteSchedule(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    await runActionRequest(
      req,
      res,
      deleteScheduleAction as ActionFn,
      'Failed to delete schedule.',
    );
  }

  @Post('users')
  @UseInterceptors(AnyFilesInterceptor())
  async createUser(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    const files = ((req as NestRequest & { files?: unknown }).files ??
      []) as UploadedFile[];

    await runActionRequest(
      req,
      res,
      createUserAction as ActionFn,
      'Failed to create user.',
      files,
    );
  }

  @Put('users')
  @UseInterceptors(AnyFilesInterceptor())
  async updateUser(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    const files = ((req as NestRequest & { files?: unknown }).files ??
      []) as UploadedFile[];

    await runActionRequest(
      req,
      res,
      updateUserAction as ActionFn,
      'Failed to update user.',
      files,
    );
  }

  @Delete('users')
  async deleteUser(
    @Req() req: NestRequest,
    @Res() res: NestResponse,
    @Body() _body: unknown,
  ) {
    await runActionRequest(
      req,
      res,
      deleteUserAction as ActionFn,
      'Failed to delete user.',
    );
  }
}
