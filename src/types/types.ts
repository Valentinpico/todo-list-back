export type UserDTO = {
  id: string; // UUID
  username: string;
  email: string;
  todos?: TodoDTO[]; // Incluye las tareas asociadas
};
export type TodoDTO = {
  id: string; // UUID
  title: string;
  completed: boolean;
};
export type User = {
  id: string; // UUID
  username: string;
  email: string;
  password: string; // Generalmente no se envía al front por seguridad
  todos?: Todo[]; // Relación con la tabla Todo
};

export type Todo = {
  id: string; // UUID
  title: string;
  completed: boolean;
  userId: string; // Relación con la tabla User
};
