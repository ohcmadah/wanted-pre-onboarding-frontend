import { createContext, useContext, useEffect, useState } from "react";
import token from "../common/token";

type State = { isAuthenticated: true; token: string } | { isAuthenticated: false };

const Context = createContext<State | undefined>(undefined);

const createState = (token?: string | null): State => {
  if (token) {
    return { isAuthenticated: true, token };
  }
  return { isAuthenticated: false };
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const accessToken = token.get();
  const initialState = createState(accessToken);
  const [auth, setAuth] = useState(initialState);

  useEffect(() => {
    const newState = createState(accessToken);
    setAuth(newState);
  }, [accessToken]);

  return <Context.Provider value={auth}>{children}</Context.Provider>;
};

export const useAuth = () => {
  const auth = useContext(Context);
  if (!auth) {
    throw new Error("AuthProvider not found");
  }
  return auth;
};
