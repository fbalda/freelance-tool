import { Client } from "@prisma/client";
import { useMemo, useRef, useState } from "react";
import {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { UseMutateFunction } from "react-query";
import { createSubmitFunction } from "./formHelpers";
import { AddMessageFunction } from "./freelanceToolContext";

export type ClientData = Client & {
  lastMonthHours: number;
  lastMonthRevenue: number;
  currentMonthHours: number;
  currentMonthRevenue: number;
};

export type MessageType = "info" | "error" | "success";
export interface Message {
  caption: string;
  type: MessageType;
  id: number;
}

export const useMessageQueue = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const idCounter = useRef(0);

  function removeMessage(id: number) {
    setMessages((messages) => messages.filter((msg) => msg.id !== id));
  }

  const addMessage = (caption: string, type: MessageType, timeout = 3000) => {
    const id = idCounter.current;
    idCounter.current += 1;

    setMessages((old) => [{ id, caption, type }, ...old]);

    setTimeout(() => {
      removeMessage(id);
    }, timeout);
  };

  return { addMessage, removeMessage, messages };
};

export const useFormErrorMessage = <TFieldValues extends FieldValues>(
  label: string,
  field: FieldPath<TFieldValues>,
  rules: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>,
  errors: FieldErrors<TFieldValues>
) => {
  let error = "";

  if (errors[field]) {
    switch (errors[field]?.type) {
      case "required":
        error = `${label} is required`;
        break;
      case "maxLength":
        error =
          `${label} must not exceed ${
            rules.maxLength ? rules.maxLength.toString() : ""
          } ` + `characters`;
        break;

      case "minLength":
        error =
          `${label} must be at least ${
            rules.minLength ? rules.minLength.toString() : ""
          } ` + `characters`;
        break;

      case "pattern":
        error = `${label} is invalid`;
        break;

      case "min":
        error = `${label} must be at least ${rules.min as string}`;
        break;

      case "max":
        error = `${label} must not exceed ${rules.max as string}`;
        break;
      case "validate":
        error = errors[field]?.message?.toString() || "";
    }
  }

  return error;
};

export const useSubmitFunction = <
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
  return useMemo(() => {
    return createSubmitFunction(mutate, addMessage, successMessage, onSuccess);
  }, [addMessage, mutate, onSuccess, successMessage]);
};
