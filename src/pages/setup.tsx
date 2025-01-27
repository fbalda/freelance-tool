import axios from "axios";
import Router from "next/router";
import { useContext } from "react";
import { useMutation } from "react-query";

import SettingsForm, { SettingsData } from "@components/forms/settingsForm";
import {
  PanelBody,
  PanelHeader,
  PanelWrapper,
} from "@components/panels/panel";
import prisma from "@lib/db";
import FreelanceToolContext from "@lib/freelanceToolContext";
import { useSubmitFunction } from "@lib/hooks";
import { withSessionSsr } from "@lib/withSession";

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
    <PanelWrapper className="self-center">
      <PanelHeader title="Setup" />

      <PanelBody>
        <SettingsForm onSubmit={handleSubmit} type={"add"} />
      </PanelBody>
    </PanelWrapper>
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
