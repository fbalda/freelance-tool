import axios, { AxiosError } from "axios";
import Router from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";

import WorkHoursForm, { WorkHoursData } from "@components/forms/workHoursForm";
import Page from "@components/page";
import { PanelHeader, PanelWrapper } from "@components/panels/panel";
import prisma from "@lib/db";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { withSessionSsrProtected } from "@lib/withSession";
import { Client, WorkHours } from "@prisma/client";

interface EditWorkHoursProps {
  workHoursData: Omit<WorkHours, "date"> & { dateISOString: string };
  clientName: string;
  clients: Client[];
}

const EditWorkHours = (props: EditWorkHoursProps) => {
  const { addMessage } = useContext(FreelanceToolContext);

  const { mutate: updateMutate } = useMutation(async (data: WorkHoursData) => {
    await axios.post(`/api/work-hours/modify`, data);
  });

  const { mutate: deleteMutate } = useMutation(
    async (data: { workHoursId: string }) => {
      await axios.post(`/api/work-hours/delete`, data);
    },
  );

  const modifyWorkHours = async (data: WorkHoursData) => {
    try {
      await new Promise<void>((resolve, reject) => {
        updateMutate(data, {
          onSuccess: () => {
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        });
      });
      addMessage("Work hours edited", "success");
      Router.back();
    } catch (error) {
      addMessage(
        ((error as AxiosError).response?.data as { response: string })
          .response || "Unknown error",
        "error",
      );
    }
  };

  const deleteWorkHours = async () => {
    try {
      await new Promise<void>((resolve, reject) => {
        deleteMutate(
          { workHoursId: props.workHoursData.id },
          {
            onSuccess: () => {
              resolve();
              Router.back();
            },
            onError: (error) => {
              reject(error);
            },
          },
        );
      });

      Router.back();
      addMessage("Work hours deleted", "success");
    } catch (error) {
      addMessage(
        ((error as AxiosError).response?.data as { response: string })
          .response || "Unknown error",
        "error",
      );
    }
  };

  return (
    <Page menu={false}>
      <PanelWrapper className="self-center">
        <PanelHeader className="pb-4 pt-4">
          <div
            className="mb-4 flex flex-row items-center border-b border-black
              px-4 pb-4 text-white"
          >
            <h2 className="grow text-lg font-bold">Edit Work Hours</h2>
          </div>
          <WorkHoursForm
            type="edit"
            defaultValues={{
              date: new Date(props.workHoursData.dateISOString),
              ...props.workHoursData,
            }}
            onSubmit={modifyWorkHours}
            onDelete={deleteWorkHours}
            clients={props.clients}
          />
        </PanelHeader>
      </PanelWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(
  async ({ req, query }) => {
    const workHoursId = query.workHoursId as string;

    const workHours = await prisma.workHours.findUnique({
      where: {
        id: workHoursId,
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!workHours) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (workHours.client.userDataId !== req.session.userId) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { client, date, ...propsData } = workHours;

    const clients = await prisma.client.findMany({
      where: { userDataId: req.session.userId },
    });

    return {
      props: {
        clientName: client.name,
        clients,
        workHoursData: {
          dateISOString: workHours.date.toISOString(),
          ...propsData,
        },
      },
    };
  },
);

export default EditWorkHours;
