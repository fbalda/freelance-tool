import ClientForm, { ClientData } from "@components/forms/clientForm";
import Page from "@components/page";
import { ToolSectionHeader, ToolSectionWrapper } from "@components/toolSection";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import { withSessionSsrProtected } from "@lib/withSession";
import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";

const AddClient = () => {
  const { addMessage } = useContext(FreelanceToolContext);

  const { mutate } = useMutation(async (data: ClientData) => {
    await axios.post(`/api/client/add`, data);
  });

  const addClient = useSubmitFunction(
    mutate,
    addMessage,
    "Client added",
    () => {
      Router.back();
    }
  );

  return (
    <Page menu={false}>
      <ToolSectionWrapper className="self-center">
        <ToolSectionHeader className="pt-4 pb-4">
          <h2
            className="pl-4 pb-4 mb-4 text-lg font-bold border-b \
          border-black"
          >
            Add Client
          </h2>
          <ClientForm onSubmit={addClient} type="add" />
        </ToolSectionHeader>
      </ToolSectionWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(() => {
  return {
    props: {},
  };
});

export default AddClient;
