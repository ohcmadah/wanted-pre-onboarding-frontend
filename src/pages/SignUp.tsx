import { useForm } from "../hooks/useForm";
import { emailValidator, passwordValidator } from "../common/validators";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Input from "../components/Input";
import Form from "../components/Form";
import Button from "../components/Button";

const SignUp = () => {
  const { values, errors, onChange } = useForm(
    { email: "", password: "" },
    { email: emailValidator, password: passwordValidator }
  );
  const isError = Object.keys(errors).length !== 0;

  return (
    <Layout>
      <Header>
        <h2 className="text-2xl font-bold">회원가입</h2>
      </Header>
      <main>
        <Form className="flex flex-col max-w-[500px] w-full">
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
    </Layout>
  );
};

export default SignUp;
