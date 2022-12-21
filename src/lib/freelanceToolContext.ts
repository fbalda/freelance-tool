import { createContext } from "react";
import { MessageType } from "./hooks";

export type AddMessageFunction = (
  caption: string,
  type: MessageType,
  timeout?: number
) => void;

const FreelanceToolContext = createContext<{ addMessage: AddMessageFunction }>({
  addMessage: () => {
    // Empty
  },
});

export default FreelanceToolContext;
