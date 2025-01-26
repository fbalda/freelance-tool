import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";

import ClientForm, { ClientData } from "@components/forms/clientForm";
import Page from "@components/page";
import {
  PanelBody,
  PanelHeader,
  PanelWrapper,
} from "@components/panels/panel";
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
      <PanelWrapper className="self-center">
        <PanelHeader title="Add Client" />
        <PanelBody>
          <ClientForm onSubmit={addClient} type="add" />
        </PanelBody>
      </PanelWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(() => {
  return {
    props: {},
  };
});

export default AddClient;
