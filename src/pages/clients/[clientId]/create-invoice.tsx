import CreateInvoiceForm from "@components/forms/createInvoiceForm";
import Page from "@components/page";
import { ToolSectionHeader, ToolSectionWrapper } from "@components/toolSection";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import { withSessionSsrProtected } from "@lib/withSession";
import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";

type CreateClientInvoiceProps = { clientId: string };

const CreateClientInvoice = (props: CreateClientInvoiceProps) => {
  const { addMessage } = useContext(FreelanceToolContext);

  const { mutate } = useMutation(async (data: string) => {
    const response = await axios.post<Blob>(
      `/api/client/create-invoice`,
      {
        month: data,
        clientId: props.clientId,
      },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice.pdf`);

    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  });

  const createInvoice = useSubmitFunction(
    mutate,
    addMessage,
    "Created Invoice",
    () => {
      Router.back();
    }
  );

  return (
    <Page menu={false} backButton>
      <ToolSectionWrapper className="self-center">
        <ToolSectionHeader className="pt-4 pb-4">
          <div
            className="px-4 pb-4 mb-4 flex flex-row items-center text-white \
            border-b border-black"
          >
            <h2 className="font-bold text-lg grow">Create Invoice</h2>
          </div>

          <div>
            <CreateInvoiceForm
              onSubmit={createInvoice}
              clientId={props.clientId}
            />
          </div>
        </ToolSectionHeader>
      </ToolSectionWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(({ query }) => {
  const clientId = query.clientId as string;

  return {
    props: { clientId },
  };
});

export default CreateClientInvoice;
