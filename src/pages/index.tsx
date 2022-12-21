import ClientList from "@components/clientList";
import WorkHoursForm from "@components/forms/workHoursForm";
import Page from "@components/page";
import {
  ToolSectionBody,
  ToolSectionHeader,
  ToolSectionWrapper,
} from "@components/toolSection";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { ClientData, useSubmitFunction } from "@lib/hooks";
import { withSessionSsrProtected } from "@lib/withSession";
import { WorkHours } from "@prisma/client";
import axios from "axios";
import Router from "next/router";
import { useContext } from "react";

import { MdPersonAdd, MdRefresh } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
    }
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
    }
  );

  const addWorkHours = useSubmitFunction(
    mutate,
    addMessage,
    "Work hours added"
  );

  const onAddClient = async () => {
    await Router.push("/clients/add");
  };

  return (
    <Page>
      <ToolSectionWrapper fullWidth>
        <ToolSectionHeader className="pt-4">
          <h2
            className="pl-4 pb-4 mb-4 text-lg font-bold border-b \
          border-black"
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
            className="py-4 px-4 flex flex-row gap-2 items-center 
          text-white"
          >
            <h2 className="font-bold text-lg">Clients</h2>
            <button
              className="link ml-auto"
              onClick={async () => {
                await refetch();
              }}
            >
              <MdRefresh size={20} />
            </button>
            <button className="link" onClick={onAddClient}>
              <MdPersonAdd size={20} />
            </button>
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
