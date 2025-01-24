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
      <ToolSectionWrapper className="self-center">
        <ToolSectionHeader className="pb-4 pt-4">
          <div
            className="mb-4 flex flex-row items-center border-b border-black
              px-4 pb-4 text-white"
          >
            <h2 className="grow text-lg font-bold"> Edit Client</h2>
          </div>

          <div>
            <ClientForm
              onSubmit={modifyClient}
              onDelete={async () => {
                await deleteClient({ clientId: props.id });
              }}
              type="edit"
              defaultValues={props}
            />
          </div>
        </ToolSectionHeader>
      </ToolSectionWrapper>
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
