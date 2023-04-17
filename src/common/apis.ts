import axios from "axios";
import token from "./token";

const API_URL = "https://www.pre-onboarding-selection-task.shop/";

const createAxiosInstance = () => {
  const accessToken = token.get();
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

type SignUpBody = {};
export const signUp = (email: string, password: string) => {
  return axios.post<SignUpBody>("/auth/signup", { email, password }, { baseURL: API_URL });
};

type SignInBody = { access_token: string };
export const signIn = (email: string, password: string) => {
  return axios.post<SignInBody>("/auth/signin", { email, password }, { baseURL: API_URL });
};

type GetTodosBody = Todo[];
export const getTodos = () => {
  const instance = createAxiosInstance();
  return instance.get<GetTodosBody>("/todos");
};

type CreateTodoBody = Todo;
export const createTodo = (todo: Todo["todo"]) => {
  const instance = createAxiosInstance();
  return instance.post<CreateTodoBody>("/todos", { todo });
};

type UpdateTodoBody = Todo;
export const updateTodo = (id: Todo["id"], todo: Todo["todo"], isCompleted: Todo["isCompleted"]) => {
  const instance = createAxiosInstance();
  return instance.put<UpdateTodoBody>("/todos/" + id, { todo, isCompleted });
};

type DeleteTodoBody = {};
export const deleteTodo = (id: Todo["id"]) => {
  const instance = createAxiosInstance();
  return instance.delete<DeleteTodoBody>("/todos/" + id);
};
