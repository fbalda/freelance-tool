import axios from "axios";
import Router from "next/router";
import { MdEdit, MdRefresh, MdRequestPage } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Page from "@components/page";
import {
  PanelBody,
  PanelHeader,
  PanelIconButton,
  PanelWrapper,
} from "@components/panels/panel";
import WorkHoursList from "@components/workHoursList";
import prisma from "@lib/db";
import { withSessionSsrProtected } from "@lib/withSession";
import { Client, WorkHours } from "@prisma/client";

const ClientDashboard = (props: Omit<Client, "userDataId">) => {
  const queryClient = useQueryClient();

  const {
    data: workHours,
    status,
    refetch,
  } = useQuery<WorkHours[]>(
    ["clientData", props.id],
    async () => {
      return (await axios.get(`/api/client/${props.id}`)).data as WorkHours[];
    },
    {
      refetchOnMount: true,
    },
  );

  const { mutate } = useMutation(
    async (workHoursId: number) => {
      await axios.get(`/api/work-hours/${workHoursId}/delete`);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["clientData", props.id], {
          refetchInactive: true,
        });
      },
    },
  );

  const removeWorkHours = (id: number) => {
    return new Promise<void>((resolve, reject) => {
      mutate(id, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  return (
    <Page backButton>
      <PanelWrapper fullWidth>
        <PanelHeader
          title={props.name}
          buttons={[
            {
              icon: MdRequestPage,
              tooltip: "Create Invoice",
              onClick: () => {
                void Router.push(`/clients/${props.id}/create-invoice`);
              },
            },
            {
              icon: MdEdit,
              tooltip: "Edit",
              onClick: () => {
                void Router.push(`/clients/${props.id}/edit`);
              },
            },
          ]}
        />
        <PanelBody>
          <section className="mt-4 flex flex-row gap-20 px-4 pb-4 text-sm">
            <div>
              <h3 className="mb-2 mt-4 text-xs font-bold">Address</h3>
              {props.fullName}
              <br />
              {props.careOf && (
                <>
                  c/o{props.careOf}
                  <br />
                </>
              )}
              {props.street} {props.houseNumber}
              <br />
              {props.zip} {props.city}
            </div>
            <div>
              <h3 className="mb-2 mt-4 text-xs font-bold">Client Number</h3>
              {("0000" + props.clientNumber.toString()).slice(-5)}
            </div>
          </section>

          <div className="flex flex-row gap-2 border-y border-neutral-4 p-4">
            <h2 className="text-md grow font-bold">Work Hours</h2>
            <PanelIconButton
              icon={MdRefresh}
              tooltip="Refetch"
              onClick={async () => {
                await refetch();
              }}
            />
          </div>
          <WorkHoursList
            status={status}
            workHours={workHours || []}
            removeWorkHours={removeWorkHours}
            clientName={props.name}
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

export default ClientDashboard;
