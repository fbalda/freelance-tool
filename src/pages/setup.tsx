import SettingsForm, { SettingsData } from "@components/forms/settingsForm";
import {
  ToolSectionBody,
  ToolSectionHeader,
  ToolSectionWrapper,
} from "@components/toolSection";
import prisma from "@lib/db";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import { withSessionSsr } from "@lib/withSession";
import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";

const Setup = () => {
  const { addMessage } = useContext(FreelanceToolContext);

  const { mutate } = useMutation(async (data: SettingsData) => {
    // Login step
    const res = await axios.post<{
      response: string;
      requiresTotp: boolean;
    }>(`/api/setup`, data);

    // Credentials correct and totp disabled, redirect to homepage
    if (res.status === 200) {
      return await Router.push("/");
    }
    addMessage(`Unexpected response: ${res.statusText}`, "error");
  });

  const handleSubmit = useSubmitFunction(mutate, addMessage, "User created");

  return (
    <ToolSectionWrapper className="self-center">
      <ToolSectionHeader className="p-4">
        <h2 className="text-lg text-left">Setup</h2>
      </ToolSectionHeader>

      <ToolSectionBody className="py-4">
        <SettingsForm onSubmit={handleSubmit} type={"add"} />
      </ToolSectionBody>
    </ToolSectionWrapper>
  );
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  if (req.session.authorized) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await prisma.client.count();

  const userCount = await prisma.userData.count();

  if (userCount) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default Setup;
