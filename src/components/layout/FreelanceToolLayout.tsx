import MessageQueue from "@components/messageQueue";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useMessageQueue } from "@lib/hooks";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const FreelanceToolLayout = (
  props: PropsWithChildren & { queryClient: QueryClient }
) => {
  const { removeMessage, messages, addMessage } = useMessageQueue();

  return (
    <>
      <FreelanceToolContext.Provider value={{ addMessage }}>
        <QueryClientProvider client={props.queryClient}>
          <div className="h-full w-full overflow-hidden">
            <main
              className="box-border m-4 flex flex-col items-start
              justify-start"
            >
              {props.children}
            </main>
          </div>
          <MessageQueue messages={messages} removeMessage={removeMessage} />
        </QueryClientProvider>
      </FreelanceToolContext.Provider>
    </>
  );
};

export default FreelanceToolLayout;
