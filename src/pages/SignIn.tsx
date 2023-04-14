import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { emailValidator, passwordValidator } from "../common/validators";
import { signIn } from "../common/apis";
import { getAPIError, isAPIError } from "../common/utils";
import token from "../common/token";
import { withAuth } from "../hocs/withAuth";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Form from "../components/Form";
import ModalPortal from "../components/ModalPortal";
import Loading from "../components/Loading";
import Popup from "../components/Popup";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError["message"] | null>(null);
  const { values, errors, onChange } = useForm(
    { email: "", password: "" },
    { email: emailValidator, password: passwordValidator }
  );
  const isError = Object.keys(errors).length !== 0;

  const onSignIn: React.FormEventHandler<HTMLFormElement> = async (_e) => {
    const { email, password } = values;
    if (isError || typeof email !== "string" || typeof password !== "string") {
      return setError("이메일 또는 비밀번호가 잘못 입력되었습니다.");
    }
    setIsLoading(true);
    try {
      const res = await signIn(email, password);
      if (!isAPIError(res.data) && res.status === 200) {
        const { access_token } = res.data;
        token.set(access_token);
        navigate("/todo");
      }
    } catch (error) {
      const apiError = getAPIError(error);
      if (apiError) {
        setError(apiError.statusCode === 401 ? "이메일과 비밀번호를 다시 확인해 주세요." : apiError.message);
      } else {
        setError("알 수 없는 에러가 발생했습니다.");
      }
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <Header>
        <h2 className="text-2xl font-bold">
          <Link to="/" className="px-2 mr-2">
            〈
          </Link>
          로그인
        </h2>
      </Header>
      <main>
        <Form className="flex flex-col max-w-[500px] w-full" onSubmit={onSignIn}>
          <Form.Email value={values.email} onChange={onChange} />
          <Form.Password value={values.password} onChange={onChange} />
          <Form.Submit disabled={isError} testid="signin-button">
            로그인
          </Form.Submit>
        </Form>
      </main>
      <ModalPortal>
        {isLoading && <Loading />}
        {error && (
          <Popup title="문제가 발생했습니다." onClose={() => setError(null)}>
            {error}
          </Popup>
        )}
      </ModalPortal>
    </Layout>
  );
};

export default withAuth(SignIn, "guest");
