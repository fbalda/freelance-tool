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
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import LoginForm, { LoginCredentials } from "../components/forms/loginForm";

const Login = () => {
  const [totpStep, setTotpStep] = useState(false);

  const { addMessage } = useContext(FreelanceToolContext);

  const { mutate } = useMutation(async (data: LoginCredentials) => {
    if (!data.totp) {
      // Login step
      const res = await axios.post<{
        response: string;
        requiresTotp: boolean;
      }>(`/api/login`, data);

      // Credentials correct and totp disabled, redirect to homepage
      if (res.status === 200) {
        if (!res.data.requiresTotp) {
          return await Router.push("/");
        }

        setTotpStep(true);
      }
      addMessage(`Unexpected response: ${res.statusText}`, "error");
    } else {
      // Totp step
      const res = await axios.post("/api/verify-totp", { totp: data.totp });
      if (res.status === 200) {
        return await Router.push("/");
      }
      addMessage(`Unexpected response: ${res.statusText}`, "error");
    }
  });

  const handleSubmit = useSubmitFunction(mutate, addMessage, "Logged in");

  return (
    <ToolSectionWrapper className="self-center">
      <ToolSectionHeader className="p-4">
        <h2 className="text-lg text-center">Login</h2>
      </ToolSectionHeader>

      <ToolSectionBody className="p-4">
        <LoginForm totpStep={totpStep} onSubmit={handleSubmit} />
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

  const userCount = await prisma.userData.count();
  if (!userCount) {
    return {
      redirect: {
        destination: "/setup",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default Login;
