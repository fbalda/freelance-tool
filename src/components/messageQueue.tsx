import { FaXmark } from "react-icons/fa6";

import { Message } from "@lib/hooks";

const MessageQueue = (props: {
  messages: Message[];
  removeMessage: (id: number) => void;
}) => {
  return (
    <div
      className="fixed right-4 top-4 flex max-w-lg flex-col items-stretch
        gap-2"
    >
      {props.messages.map((message) => {
        let color = "";

        switch (message.type) {
          case "error":
            color = "bg-red-700";
            break;
          case "success":
            color = "bg-green-700";
            break;
          case "info":
            color = "bg-blue-700";
            break;
        }

        return (
          <div
            className={`p-3 ${color} flex flex-row items-center justify-end
            rounded-md text-white`}
            key={message.id}
          >
            <div className="mr-2">{message.caption}</div>
            <button
              onClick={() => {
                props.removeMessage(message.id);
              }}
            >
              <FaXmark />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MessageQueue;
