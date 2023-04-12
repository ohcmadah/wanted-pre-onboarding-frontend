import axios from "axios";

export const signUp = (email: string, password: string) => {
  return axios.post("/api/auth/signup", { email, password });
};
