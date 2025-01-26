import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

import SettingsForm, { SettingsData } from "@components/forms/settingsForm";
import Page from "@components/page";
import {
  PanelBody,
  PanelHeader,
  PanelWrapper,
} from "@components/panels/panel";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import logger from "@lib/logger";
import { withSessionSsrProtected } from "@lib/withSession";

const Settings = (props: SettingsData) => {
  const queryClient = useQueryClient();
  const { addMessage } = useContext(FreelanceToolContext);

  const { mutate } = useMutation(
    async (data: SettingsData) => {
      await axios.post("/api/update-settings", data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["clients"], {
          refetchInactive: true,
        });
      },
    },
  );

  const saveChanges = useSubmitFunction(mutate, addMessage, "Changes saved!");

  return (
    <Page backButton>
      <PanelWrapper fullWidth>
        <PanelHeader title="Settings" />
        <PanelBody>
          <SettingsForm
            type="edit"
            onSubmit={saveChanges}
            defaultValues={props}
          />
        </PanelBody>
      </PanelWrapper>
    </Page>
  );
};

export const getServerSideProps = withSessionSsrProtected(async ({ req }) => {
  const userData = await prisma.userData.findUnique({
    where: { id: req.session.userId },
  });

  if (!userData) {
    // Failsafe, this should never happen
    logger.error(
      `No user data found for logged in user with id ${req.session.userId} `,
    );
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { pwhash, salt, createdAt, totpsecret, id, ...settingsData } =
    userData;

  return {
    props: settingsData,
  };
});

export default Settings;
