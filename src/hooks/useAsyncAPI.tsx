import { useEffect, useState } from "react";
import { getAPIError } from "../common/utils";
import { useForceUpdate } from "./useForceUpdate";

type State<T> =
  | { state: "loading"; isLoading: true; isError: false; error: null }
  | { state: "error"; isLoading: false; isError: true; error: string }
  | { state: "loaded"; isLoading: false; isError: false; error: null; data: T };
type API = (...args: any[]) => Promise<any>;

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
        const apiError = getAPIError(error);
        const message = apiError?.message || "알 수 없는 에러가 발생했습니다.";
        setState(() => ({ state: "error", isLoading: false, isError: true, error: message }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);

  return { ...state, forceUpdate };
};
