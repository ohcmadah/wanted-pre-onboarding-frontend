import { createContext, useContext, useReducer } from "react";
import token from "../common/token";

type State = { isAuthenticated: true; token: string } | { isAuthenticated: false };
type Action = { type: "SIGNIN"; payload: { token: string } };
type AuthDispatch = React.Dispatch<Action>;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<AuthDispatch | undefined>(undefined);

const createState = (token?: string | null): State => {
  if (token) {
    return { isAuthenticated: true, token };
  }
  return { isAuthenticated: false };
};

const reducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case "SIGNIN":
      token.set(action.payload.token);
      return { isAuthenticated: true, token: action.payload.token };

    default:
      throw new Error("Unhandled action");
  }
};

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const accessToken = token.get();
  const initialState = createState(accessToken);
  const [auth, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={auth}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => {
  const auth = useContext(StateContext);
  if (!auth) {
    throw new Error("AuthProvider not found");
  }
  return auth;
};

export const useAuthDispatch = () => {
  const dispatch = useContext(DispatchContext);
  if (!dispatch) {
    throw new Error("AuthProvider not found");
  }
  return dispatch;
};
