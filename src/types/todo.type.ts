export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedTodoDTO {
  title: string;
}

export interface UpdatedTodoDTO {
  title: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
