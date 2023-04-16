import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../common/apis";
import { useAsyncAPI } from "../hooks/useAsyncAPI";
import { useAuthState } from "../contexts/AuthContext";
import { useInput } from "../hooks/useInput";
import { getAPIError } from "../common/utils";

import Header from "../components/Header";
import Layout from "../components/Layout";
import ModalPortal from "../components/ModalPortal";
import Loading, { Spinner } from "../components/Loading";
import Popup from "../components/Popup";
import Input from "../components/Input";
import Form from "../components/Form";

type AddFn = (todo: Todo["todo"]) => any;
type EditFn = (id: Todo["id"], todo: Todo["todo"], isCompleted: Todo["isCompleted"]) => any;
type DeleteFn = (id: Todo["id"]) => any;

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={[
      "px-3 py-2 border border-primary text-primary min-w-[55px]",
      !props.disabled && "hover:bg-primary hover:text-white",
      "disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed",
      props.children,
    ].join(" ")}
  >
    {props.children}
  </button>
);

const TodoContainer = ({ children }: { children: React.ReactNode }) => (
  <li className="mb-5 last:mb-0 flex items-center">{children}</li>
);
const Checkbox = (props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) => (
  <input {...props} type="checkbox" className={["mr-3", props.className].join(" ")} />
);

const Todo = ({ id, todo, isCompleted, onEdit, onDelete }: Todo & { onEdit: EditFn; onDelete: DeleteFn }) => {
  const newTodo = useInput(todo);
  const [isEditing, setIsEditing] = useState(false);

  const onCheck = () => onEdit(id, todo, !isCompleted);
  const stopEditing = () => {
    newTodo.clear();
    setIsEditing(false);
  };
  const startEditing = () => setIsEditing(true);
  const onEditTodo = () => onEdit(id, newTodo.value, isCompleted);
  const onDeleteTodo = () => onDelete(id);

  if (isEditing) {
    return (
      <TodoContainer>
        <Checkbox checked={isCompleted} onChange={onCheck} />
        <Form className="flex w-full" onSubmit={onEditTodo}>
          <Input value={newTodo.value} onChange={newTodo.onChange} className="w-full mr-3" data-testid="modify-input" />
          <Button type="submit" disabled={todo === newTodo.value} data-testid="submit-button">
            제출
          </Button>
          <Button type="button" data-testid="cancel-button" onClick={stopEditing}>
            취소
          </Button>
        </Form>
      </TodoContainer>
    );
  }

  return (
    <TodoContainer>
      <label className="flex-1 mr-3">
        <Checkbox checked={isCompleted} onChange={onCheck} />
        <span>{todo}</span>
      </label>
      <Button data-testid="modify-button" onClick={startEditing}>
        수정
      </Button>
      <Button data-testid="delete-button" onClick={onDeleteTodo}>
        삭제
      </Button>
    </TodoContainer>
  );
};

const NewTodo = ({ onAdd }: { onAdd: AddFn }) => {
  const todo = useInput("");
  const onSubmit = async () => {
    await onAdd(todo.value);
    todo.clear();
  };
  return (
    <Form className="flex gap-x-3 mb-5" onSubmit={onSubmit}>
      <Input value={todo.value} onChange={todo.onChange} className="w-full" data-testid="new-todo-input" />
      <Form.Submit testid="new-todo-add-button">추가</Form.Submit>
    </Form>
  );
};

const Todos = ({
  todos,
  onEdit,
  onDelete,
}: {
  todos: ReturnType<typeof useAsyncAPI<typeof getTodos>>;
  onEdit: EditFn;
  onDelete: DeleteFn;
}) => {
  switch (todos.state) {
    case "loading":
      return <Spinner />;

    case "error":
      return null;

    case "loaded":
      const data = todos.data.data;
      if (data.length === 0) {
        return <div className="text-gray-500">TODO가 존재하지 않습니다.</div>;
      }
      return (
        <ul>
          {data.map((todo) => (
            <Todo key={todo.id} {...todo} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      );
  }
};

const TodoList = ({ token }: { token: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const todos = useAsyncAPI(() => getTodos(token));
  const navigate = useNavigate();

  const fetch = async <F extends API>(api: F, ...args: Parameters<F>) => {
    setIsLoading(true);
    try {
      const res = await api(...args);
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        todos.forceUpdate();
      }
    } catch (error) {
      const apiError = getAPIError(error);
      if (apiError?.statusCode === 401) {
        setError({ ...apiError, message: "로그인이 필요한 기능입니다." });
      }
      setError(apiError);
    }
    setIsLoading(false);
  };

  const onAdd: AddFn = (todo) => fetch(createTodo, todo, token);
  const onEdit: EditFn = (id, todo, isCompleted) => fetch(updateTodo, id, todo, isCompleted, token);
  const onDelete: DeleteFn = (id) => fetch(deleteTodo, id, token);

  return (
    <Layout>
      <Header>
        <h2 className="text-2xl font-bold">TODO</h2>
      </Header>

      <main>
        <NewTodo onAdd={onAdd} />
        <Todos todos={todos} onEdit={onEdit} onDelete={onDelete} />
      </main>

      <ModalPortal>
        {isLoading && <Loading />}
        {todos.isError && (
          <Popup title="문제가 발생했습니다." onClose={todos.forceUpdate}>
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
            {error.message}
          </Popup>
        )}
      </ModalPortal>
    </Layout>
  );
};

const TodoListWrapper = () => {
  const auth = useAuthState();

  if (!auth.isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <TodoList token={auth.token} />;
};

export default TodoListWrapper;
