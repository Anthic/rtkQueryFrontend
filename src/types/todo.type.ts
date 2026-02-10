export interface ITodo {
  id: number;
  title: string;
  image: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedTodoDTO {
  title: string;
  image?: File
}

export interface UpdatedTodoDTO {
  title: string;
  completed?: boolean;
  image?: File
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
