import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const withAuth = (Component: React.FC, option: "auth" | "guest" = "auth") => {
  return () => {
    const auth = useAuth();

    switch (option) {
      case "guest":
        if (auth.isAuthenticated) {
          return <Navigate to="/todo" replace />;
        } else {
          return <Component />;
        }

      case "auth":
        if (auth.isAuthenticated) {
          return <Component />;
        } else {
          return <Navigate to="/signin" replace />;
        }
    }
  };
};
