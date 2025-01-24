import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";

import ClientForm, { ClientData } from "@components/forms/clientForm";
import Page from "@components/page";
import {
  ToolSectionHeader,
  ToolSectionWrapper,
} from "@components/toolSection";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import { withSessionSsrProtected } from "@lib/withSession";

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
    },
  );

  return (
    <Page menu={false}>
      <ToolSectionWrapper className="self-center">
        <ToolSectionHeader className="pb-4 pt-4">
          <h2
            className="mb-4 border-b border-black pb-4 pl-4 text-lg font-bold"
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
