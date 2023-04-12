import { AxiosError } from "axios";

export const isAPIError = (data: APIError | any): data is APIError => {
  return (data as APIError).error !== undefined;
};

export const getAPIErrorMessage = (error: unknown) => {
  return (error as AxiosError<APIError>).response?.data.message || "알 수 없는 에러가 발생하였습니다.";
};
