import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { emailValidator, passwordValidator } from "../common/validators";
import { signUp } from "../common/apis";
import { getAPIErrorMessage, isAPIError } from "../common/utils";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Input from "../components/Input";
import Form from "../components/Form";
import Button from "../components/Button";
import ModalPortal from "../components/ModalPortal";
import Loading from "../components/Loading";
import Popup from "../components/Popup";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError["message"] | null>(null);
  const { values, errors, onChange } = useForm(
    { email: "", password: "" },
    { email: emailValidator, password: passwordValidator }
  );
  const isError = Object.keys(errors).length !== 0;

  const onSignUp: React.FormEventHandler<HTMLFormElement> = async (_e) => {
    const { email, password } = values;
    if (isError || typeof email !== "string" || typeof password !== "string") {
      return setError("이메일 또는 비밀번호가 잘못 입력되었습니다.");
    }
    setIsLoading(true);
    try {
      const res = await signUp(email, password);
      if (res.status === 201) {
        navigate("/signin");
      } else if (isAPIError(res.data)) {
        setError(res.data.message);
      }
    } catch (error) {
      const errorMsg = getAPIErrorMessage(error);
      setError(errorMsg);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <Header>
        <h2 className="text-2xl font-bold">회원가입</h2>
      </Header>
      <main>
        <Form className="flex flex-col max-w-[500px] w-full" onSubmit={onSignUp}>
          <Form.Label htmlFor="email">이메일</Form.Label>
          <Input
            type="text"
            value={values.email}
            onChange={onChange}
            className="mb-5"
            name="email"
            id="email"
            data-testid="email-input"
          />

          <Form.Label htmlFor="password">비밀번호</Form.Label>
          <Input
            type="password"
            value={values.password}
            onChange={onChange}
            name="password"
            id="password"
            data-testid="password-input"
          />

          <Button
            type="submit"
            disabled={isError}
            data-testid="signup-button"
            className="bg-primary text-white font-medium mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            회원가입
          </Button>
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

export default SignUp;
