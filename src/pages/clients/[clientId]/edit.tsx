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
import prisma from "@lib/db";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import { withSessionSsrProtected } from "@lib/withSession";
import { Client } from "@prisma/client";

type EditClientProps = Omit<Client, "userDataId">;

const EditClient = (props: EditClientProps) => {
  const { addMessage } = useContext(FreelanceToolContext);

  const { mutate: updateMutate } = useMutation(async (data: ClientData) => {
    await axios.post(`/api/client/modify`, data);
  });

  const { mutate: deleteMutate } = useMutation(
    async (data: { clientId: string }) => {
      await axios.post(`/api/client/delete`, data);
    },
  );

  const modifyClient = useSubmitFunction(
    updateMutate,
    addMessage,
    "Client edited",
    () => {
      Router.back();
    },
  );

  const deleteClient = useSubmitFunction(
    deleteMutate,
    addMessage,
    "Client deleted",
    () => {
      Router.back();
    },
  );

  return (
    <Page menu={false}>
      <PanelWrapper className="self-center">
        <PanelHeader title="Edit Client" />
        <PanelBody>
          <ClientForm
            onSubmit={modifyClient}
            onDelete={async () => {
              await deleteClient({ clientId: props.id });
            }}
            type="edit"
            defaultValues={props}
          />
        </PanelBody>
      </PanelWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(
  async ({ query }) => {
    const clientId = query.clientId as string;
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { userDataId, ...propsData } = client;

    return {
      props: propsData,
    };
  },
);

export default EditClient;
