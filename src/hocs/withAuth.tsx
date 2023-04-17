import { Navigate } from "react-router-dom";
import token from "../common/token";

export const withAuth = (Component: React.FC, option: "auth" | "guest") => {
  return () => {
    const accessToken = token.get();

    switch (option) {
      case "auth":
        if (accessToken) {
          return <Component />;
        } else {
          return <Navigate to="/signin" />;
        }

      case "guest":
        if (accessToken) {
          return <Navigate to="/todo" />;
        } else {
          return <Component />;
        }
    }
  };
};
