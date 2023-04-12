import axios from "axios";

type SignUpBody = {};
export const signUp = (email: string, password: string) => {
  return axios.post<SignUpBody | APIError>("/api/auth/signup", { email, password });
};
