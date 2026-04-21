import { PaginationType } from '../common';

export interface RoomListQueryInput {
  floor?: string;
  search?: string;
  page?: string;
  pageSize?: string;
}

export interface RoomListFilters {
  floor: string;
  search: string;
}

export interface RoomListRow {
  id: number;
  roomCode: string;
  roomName: string;
  level: number;
}

export interface RoomListData {
  rows: RoomListRow[];
  floors: number[];
  filters: RoomListFilters;
  pagination: PaginationType;
}
