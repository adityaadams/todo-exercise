export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'newest' | 'oldest';