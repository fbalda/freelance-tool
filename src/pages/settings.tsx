import SettingsForm, { SettingsData } from "@components/forms/settingsForm";
import Page from "@components/page";
import {
  ToolSectionBody,
  ToolSectionHeader,
  ToolSectionWrapper,
} from "@components/toolSection";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import logger from "@lib/logger";
import { withSessionSsrProtected } from "@lib/withSession";
import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

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
    }
  );

  const saveChanges = useSubmitFunction(mutate, addMessage, "Changes saved!");

  return (
    <Page backButton>
      <ToolSectionWrapper fullWidth>
        <ToolSectionHeader>
          <h2 className="font-bold text-lg p-4">Settings</h2>
        </ToolSectionHeader>
        <ToolSectionBody className="flex flex-col items-stretch p-4 text-md">
          <SettingsForm
            type="edit"
            onSubmit={saveChanges}
            defaultValues={props}
          />
        </ToolSectionBody>
      </ToolSectionWrapper>
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
      `No user data found for logged in user with id ${req.session.userId} `
    );
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { pwhash, salt, createdAt, totpsecret, id, ...settingsData } = userData;

  return {
    props: settingsData,
  };
});

export default Settings;
