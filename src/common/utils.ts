import { AxiosError } from "axios";

export const isAPIError = (data: APIError | any): data is APIError => {
  return (data as APIError).error !== undefined;
};

export const getAPIError = (error: unknown) => {
  const axiosError = error as AxiosError<APIError>;
  const apiError = axiosError.response?.data;
  if (apiError) {
    return apiError;
  }
  return null;
};

export const partial = (f: Function, ...args: any[]) => f.bind(null, ...args);
