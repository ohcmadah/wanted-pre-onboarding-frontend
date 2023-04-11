import Layout from "../components/Layout";
import Header from "../components/Header";
import Input from "../components/Input";
import Form from "../components/Form";
import Button from "../components/Button";

const SignUp = () => {
  const onSubmit: React.ComponentProps<typeof Form>["onSubmit"] = (values) => {};

  return (
    <Layout>
      <Header>
        <h2 className="text-2xl font-bold">회원가입</h2>
      </Header>
      <main>
        <Form className="flex flex-col max-w-[500px] w-full" onSubmit={onSubmit}>
          <Form.Label htmlFor="email">이메일</Form.Label>
          <Input type="text" className="mb-5" name="email" id="email" data-testid="email-input" />

          <Form.Label htmlFor="password">비밀번호</Form.Label>
          <Input type="password" name="password" id="password" data-testid="password-input" />

          <Button type="submit" data-testid="signup-button" className="bg-primary text-white font-medium mt-8">
            회원가입
          </Button>
        </Form>
      </main>
    </Layout>
  );
};

export default SignUp;
