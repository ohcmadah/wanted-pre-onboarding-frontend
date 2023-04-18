import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../common/apis";
import { useAsyncAPI } from "../hooks/useAsyncAPI";
import { useInput } from "../hooks/useInput";
import { getAPIError, partial } from "../common/utils";

import Header from "../components/Header";
import Layout from "../components/Layout";
import ModalPortal from "../components/ModalPortal";
import Loading, { Spinner } from "../components/Loading";
import Popup from "../components/Popup";
import Input from "../components/Input";
import Form from "../components/Form";
import { withAuth } from "../hocs/withAuth";

type AddFn = (...args: Parameters<typeof createTodo>) => any;
type EditFn = (...args: Parameters<typeof updateTodo>) => any;
type DeleteFn = (...args: Parameters<typeof deleteTodo>) => any;

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
      <Form.Submit data-testid="new-todo-add-button">추가</Form.Submit>
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

const TodoList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const todos = useAsyncAPI(getTodos);
  const navigate = useNavigate();

  const redirectSignIn = (error: APIError) => {
    if (error.statusCode === 401) {
      navigate("/signin");
    }
  };

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

  const onAdd: AddFn = partial(fetch, createTodo);
  const onEdit: EditFn = partial(fetch, updateTodo);
  const onDelete: DeleteFn = partial(fetch, deleteTodo);

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
          <Popup
            title="문제가 발생했습니다."
            onClose={() => {
              redirectSignIn(todos.error);
              todos.forceUpdate();
            }}
          >
            {todos.error.message}
          </Popup>
        )}
        {error && (
          <Popup
            title="문제가 발생했습니다."
            onClose={() => {
              redirectSignIn(error);
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

export default withAuth(TodoList, "auth");
