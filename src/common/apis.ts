import axios from "axios";

type SignUpBody = {};
export const signUp = (email: string, password: string) => {
  return axios.post<SignUpBody | APIError>("/api/auth/signup", { email, password });
};

type SignInBody = { access_token: string };
export const signIn = (email: string, password: string) => {
  return axios.post<SignInBody | APIError>("/api/auth/signin", { email, password });
};
