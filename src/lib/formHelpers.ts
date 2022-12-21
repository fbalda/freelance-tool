import { AxiosError } from "axios";
import { UseMutateFunction } from "react-query";
import { AddMessageFunction } from "./freelanceToolContext";

export const createSubmitFunction = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutate: UseMutateFunction<TData, TError, TVariables, TContext>,
  addMessage: AddMessageFunction,
  successMessage: string,
  onSuccess?: () => void
) => {
  return async (data: TVariables) => {
    try {
      await new Promise<void>((resolve, reject) => {
        mutate(data, {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        });
      });
      addMessage(successMessage, "success");
      onSuccess?.();
    } catch (error) {
      addMessage(
        ((error as AxiosError).response?.data as { response: string })
          .response || "Unknown error",
        "error"
      );
    }
  };
};
