import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { MdPersonAdd, MdRefresh } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";

import ClientList from "@components/clientList";
import WorkHoursForm from "@components/forms/workHoursForm";
import Page from "@components/page";
import {
  PanelBody,
  PanelHeader,
  PanelWrapper,
} from "@components/panels/panel";
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
    async () => (await axios.get("/api/clients")).data as ClientData[],
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

  const onAddClient = () => {
    void Router.push("/clients/add");
  };

  return (
    <Page>
      <PanelWrapper fullWidth>
        <PanelHeader title="Add Work Hours" />
        <PanelBody>
          <WorkHoursForm
            type="add"
            onSubmit={addWorkHours}
            clients={clients || []}
          />
        </PanelBody>
      </PanelWrapper>
      <PanelWrapper fullWidth>
        <PanelHeader
          title="Clients"
          buttons={[
            {
              icon: MdRefresh,
              tooltip: "Refetch",
              onClick: () => {
                void refetch();
              },
            },
            {
              icon: MdPersonAdd,
              tooltip: "Add Client",
              onClick: onAddClient,
            },
          ]}
        />
        <PanelBody>
          <ClientList status={status} clients={clients || []} />
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

export default FreelanceTool;
