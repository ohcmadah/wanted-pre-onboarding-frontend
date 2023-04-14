import { useReducer } from "react";

export const useForceUpdate = () => {
  const [updated, forceUpdate] = useReducer((state) => !state, false);
  return { updated, forceUpdate };
};
