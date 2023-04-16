import axios from "axios";

type SignUpBody = {};
export const signUp = (email: string, password: string) => {
  return axios.post<SignUpBody>("/api/auth/signup", { email, password });
};

type SignInBody = { access_token: string };
export const signIn = (email: string, password: string) => {
  return axios.post<SignInBody>("/api/auth/signin", { email, password });
};

type GetTodosBody = Todo[];
export const getTodos = (token: string) => {
  return axios.get<GetTodosBody>("/api/todos", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

type CreateTodoBody = Todo;
export const createTodo = (todo: Todo["todo"], token: string) => {
  return axios.post<CreateTodoBody>(
    "/api/todos",
    { todo },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};

type UpdateTodoBody = Todo;
export const updateTodo = (id: Todo["id"], todo: Todo["todo"], isCompleted: Todo["isCompleted"], token: string) => {
  return axios.put<UpdateTodoBody>(
    "/api/todos/" + id,
    { todo, isCompleted },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
};
