import { Link } from "react-router-dom";
import { withAuth } from "../hocs/withAuth";

import Layout from "../components/Layout";
import Header from "../components/Header";
import Button from "../components/Button";

const Main = () => (
  <Layout className="flex flex-col items-center text-center h-full justify-center">
    <Header>
      <h1 className="text-3xl font-bold">To-Do App</h1>
      <p className="mt-1 text-base text-gray-700">나만의 일정 관리를 지금 시작해 보세요.</p>
    </Header>
    <main className="flex flex-col max-w-[300px] w-full gap-y-3">
      <Link to="/signin">
        <Button className="bg-primary font-medium text-white w-full">로그인</Button>
      </Link>
      <Link to="/signup">
        <Button className="bg-transparent font-medium text-primary border border-primary w-full">회원가입</Button>
      </Link>
    </main>
  </Layout>
);

export default withAuth(Main, "guest");
