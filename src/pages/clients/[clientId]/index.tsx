import Page from "@components/page";
import {
  ToolSectionBody,
  ToolSectionHeader,
  ToolSectionWrapper,
} from "@components/toolSection";
import WorkHoursList from "@components/workHoursList";
import prisma from "@lib/db";
import { withSessionSsrProtected } from "@lib/withSession";
import { Client, WorkHours } from "@prisma/client";
import axios from "axios";
import Router from "next/router";
import { MdEdit, MdRefresh, MdRequestPage } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "react-query";

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
    }
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
    }
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
      <ToolSectionWrapper fullWidth>
        <ToolSectionHeader>
          <div
            className="p-4 flex flex-row items-center text-white \
          border-b border-black gap-2"
          >
            <h2 className="font-bold text-lg grow">{props.name}</h2>
            <button
              className="link"
              onClick={async () => {
                await Router.push(`/clients/${props.id}/create-invoice`);
              }}
            >
              <MdRequestPage size={20} />
            </button>
            <button
              className="link"
              onClick={async () => {
                await Router.push(`/clients/${props.id}/edit`);
              }}
            >
              <MdEdit size={20} />
            </button>
          </div>

          <section className="px-4 pb-4 text-sm mt-4 flex flex-row gap-20">
            <div>
              <h3 className="font-bold text-xs mb-2 mt-4">Address</h3>
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
              <h3 className="font-bold text-xs mb-2 mt-4">Client Number</h3>
              {("0000" + props.clientNumber.toString()).slice(-5)}
            </div>
          </section>

          <div className="flex flex-row border-t p-4 border-black gap-2">
            <h2 className="font-bold text-md">Work Hours</h2>
            <button
              className="link ml-auto"
              onClick={async () => {
                await refetch();
              }}
            >
              <MdRefresh size={20} />
            </button>
          </div>
        </ToolSectionHeader>
        <ToolSectionBody className="flex flex-col items-stretch">
          <WorkHoursList
            status={status}
            workHours={workHours || []}
            removeWorkHours={removeWorkHours}
            clientName={props.name}
          />
        </ToolSectionBody>
      </ToolSectionWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(async ({ query }) => {
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
});

export default ClientDashboard;
