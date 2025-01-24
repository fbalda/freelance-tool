import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { MdPersonAdd, MdRefresh } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";

import ClientList from "@components/clientList";
import WorkHoursForm from "@components/forms/workHoursForm";
import Page from "@components/page";
import {
  ToolSectionBody,
  ToolSectionHeader,
  ToolSectionIconButton,
  ToolSectionWrapper,
} from "@components/toolSection";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { ClientData, useSubmitFunction } from "@lib/hooks";
import { withSessionSsrProtected } from "@lib/withSession";
import { WorkHours } from "@prisma/client";

const FreelanceTool = () => {
  const queryClient = useQueryClient();
  const { addMessage } = useContext(FreelanceToolContext);

  const {
    data: clients,
    status,
    refetch,
  } = useQuery<ClientData[]>(
    ["clients"],
    async () => {
      return (await axios.get("/api/clients")).data as ClientData[];
    },
    {
      refetchOnMount: true,
    },
  );

  const { mutate } = useMutation(
    async (workHours: Omit<WorkHours, "id">) => {
      await axios.post("/api/work-hours/add", workHours);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["clients"], {
          refetchInactive: true,
        });
      },
    },
  );

  const addWorkHours = useSubmitFunction(
    mutate,
    addMessage,
    "Work hours added",
  );

  const onAddClient = async () => {
    await Router.push("/clients/add");
  };

  return (
    <Page>
      <ToolSectionWrapper fullWidth>
        <ToolSectionHeader className="pt-4">
          <h2
            className="mb-4 border-b border-neutral-4 pb-4 pl-4 text-lg
              font-bold"
          >
            Add Work Hours
          </h2>
          <WorkHoursForm
            type="add"
            onSubmit={addWorkHours}
            clients={clients || []}
          />
        </ToolSectionHeader>
      </ToolSectionWrapper>
      <ToolSectionWrapper fullWidth>
        <ToolSectionHeader>
          <div
            className="flex flex-row items-center gap-2 px-4 py-4 text-white"
          >
            <h2 className="grow text-lg font-bold">Clients</h2>
            <ToolSectionIconButton
              icon={MdRefresh}
              tooltip="Refetch"
              onClick={async () => {
                await refetch();
              }}
            />

            <ToolSectionIconButton
              icon={MdPersonAdd}
              tooltip="Add Client"
              onClick={onAddClient}
            />
          </div>
        </ToolSectionHeader>
        <ToolSectionBody className="flex flex-col items-stretch">
          <ClientList status={status} clients={clients || []} />
        </ToolSectionBody>
      </ToolSectionWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(() => {
  return {
    props: {},
  };
});

export default FreelanceTool;
