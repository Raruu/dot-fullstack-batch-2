import { PaginationType } from '../common';

export interface UserListQueryInput {
  status?: string;
  search?: string;
  page?: string;
  pageSize?: string;
}

export interface UserListFilters {
  status: string;
  search: string;
}

export interface UserListRow {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
}

export interface UserListData {
  rows: UserListRow[];
  filters: UserListFilters;
  pagination: PaginationType;
}
