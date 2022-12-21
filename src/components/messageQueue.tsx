import { Message } from "@lib/hooks";
import { HiXMark } from "react-icons/hi2";

const MessageQueue = (props: {
  messages: Message[];
  removeMessage: (id: number) => void;
}) => {
  return (
    <div
      className="fixed right-4 top-4 flex flex-col items-stretch \
    max-w-lg gap-2"
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
            className={`p-3 ${color} rounded-md text-white flex flex-row \
            items-center justify-end`}
            key={message.id}
          >
            <div className="mr-2">{message.caption}</div>
            <button
              onClick={() => {
                props.removeMessage(message.id);
              }}
            >
              <HiXMark />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MessageQueue;
