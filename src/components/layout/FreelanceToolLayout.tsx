import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import MessageQueue from "@components/messageQueue";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useMessageQueue } from "@lib/hooks";

const FreelanceToolLayout = (
  props: PropsWithChildren & { queryClient: QueryClient },
) => {
  const { removeMessage, messages, addMessage } = useMessageQueue();

  return (
    <>
      <FreelanceToolContext.Provider value={{ addMessage }}>
        <QueryClientProvider client={props.queryClient}>
          <div className="h-full w-full overflow-hidden">
            <main
              className="m-4 box-border flex flex-col items-start
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
