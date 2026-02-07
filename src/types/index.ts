// Re-export all types for easy importing
export * from './user.types';
export * from './plan.types';
export * from './log.types';
export * from './ai.types';
export * from './settings.types';

// Common types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order: SortOrder;
}
