import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createTodo, getTodos } from "../common/apis";
import { useAsyncAPI } from "../hooks/useAsyncAPI";
import { useAuth } from "../contexts/AuthContext";
import { useInput } from "../hooks/useInput";
import { getAPIError } from "../common/utils";

import Header from "../components/Header";
import Layout from "../components/Layout";
import ModalPortal from "../components/ModalPortal";
import Loading, { Spinner } from "../components/Loading";
import Popup from "../components/Popup";
import Input from "../components/Input";
import Form from "../components/Form";

const Todo = ({ id, todo, isCompleted, userId }: Todo) => (
  <li className="mb-5 last:mb-0">
    <label>
      <input type="checkbox" checked={isCompleted} className="mr-3" />
      <span>{todo}</span>
    </label>
  </li>
);

const NewTodo = ({ onAdd }: { onAdd: (todo: string) => any }) => {
  const todo = useInput("");
  const onSubmit = async () => {
    await onAdd(todo.value);
    todo.clear();
  };
  return (
    <Form className="flex gap-x-3 mb-5" onSubmit={onSubmit}>
      <Input value={todo.value} onChange={todo.onChange} data-testid="new-todo-input" />
      <Form.Submit className="mt-0" testid="new-todo-add-button">
        추가
      </Form.Submit>
    </Form>
  );
};

const Todos = ({ todos }: { todos: Todo[] }) =>
  todos.length ? (
    <ul>
      {todos.map((todo) => (
        <Todo key={todo.id} {...todo} />
      ))}
    </ul>
  ) : (
    <div className="text-gray-500">TODO가 존재하지 않습니다.</div>
  );

const TodoList = ({ token }: { token: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const todos = useAsyncAPI(() => getTodos(token));
  const navigate = useNavigate();

  const onAdd = async (todo: string) => {
    setIsLoading(true);
    try {
      const res = await createTodo(todo, token);
      if (res.status === 201) {
        todos.forceUpdate();
      }
    } catch (error) {
      const apiError = getAPIError(error);
      setError(apiError);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <Header>
        <h2 className="text-2xl font-bold">TODO</h2>
      </Header>

      <main>
        <NewTodo onAdd={onAdd} />
        {todos.isLoading ? <Spinner /> : <Todos todos={todos.isError ? [] : todos.data.data} />}
      </main>

      <ModalPortal>
        {isLoading && <Loading />}
        {todos.isError && (
          <Popup title="문제가 발생했습니다." onClose={() => todos.forceUpdate()}>
            {todos.error}
          </Popup>
        )}
        {error && (
          <Popup
            title="문제가 발생했습니다."
            onClose={() => {
              if (error.statusCode === 401) {
                navigate("/signin");
              }
              setError(null);
            }}
          >
            {error.statusCode === 401 ? "로그인이 필요한 기능입니다." : error.message}
          </Popup>
        )}
      </ModalPortal>
    </Layout>
  );
};

const TodoListWrapper = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <TodoList token={auth.token} />;
};

export default TodoListWrapper;
