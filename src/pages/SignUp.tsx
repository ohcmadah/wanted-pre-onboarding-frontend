import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { emailValidator, passwordValidator } from "../common/validators";
import { signUp } from "../common/apis";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Input from "../components/Input";
import Form from "../components/Form";
import Button from "../components/Button";

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, onChange } = useForm(
    { email: "", password: "" },
    { email: emailValidator, password: passwordValidator }
  );
  const isError = Object.keys(errors).length !== 0;

  const onSignUp: React.FormEventHandler<HTMLFormElement> = async (_e) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("이메일 또는 비밀번호가 잘못 입력되었습니다.");
      }
      const res = await signUp(email, password);
      if (res.status === 201) {
        navigate("/signin");
      }
    } catch (error) {}
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
      {isLoading && (
        // TODO: portal, modal component
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-gray-500/50 py-12 text-center text-white">
          Loading...
        </div>
      )}
    </Layout>
  );
};

export default SignUp;
