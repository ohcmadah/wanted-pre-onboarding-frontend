import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getAPIError } from "../common/utils";
import { useForceUpdate } from "./useForceUpdate";

type State<T> =
  | { state: "loading"; isLoading: true; isError: false; error: null }
  | { state: "error"; isLoading: false; isError: true; error: APIError }
  | { state: "loaded"; isLoading: false; isError: false; error: null; data: T };

export const useAsyncAPI = <F extends API>(api: F, ...args: Parameters<F>) => {
  type Data = Awaited<ReturnType<F>>;
  const [state, setState] = useState<State<Data>>({
    state: "loading",
    isLoading: true,
    isError: false,
    error: null,
  });
  const { updated, forceUpdate } = useForceUpdate();

  useEffect(() => {
    (async () => {
      setState({ state: "loading", isLoading: true, isError: false, error: null });
      try {
        const data = await api(...args);
        setState(() => ({ state: "loaded", isLoading: false, isError: false, error: null, data }));
      } catch (error: any) {
        if (error instanceof AxiosError) {
          const apiError = getAPIError(error);
          if (apiError) {
            setState(() => ({ state: "error", isLoading: false, isError: true, error: apiError }));
          } else {
            setState(() => ({
              state: "error",
              isLoading: false,
              isError: true,
              error: { statusCode: error.status, message: error.message },
            }));
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);

  return { ...state, forceUpdate };
};
