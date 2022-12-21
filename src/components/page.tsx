import FreelanceToolContext from "@lib/freelanceToolContext";
import axios, { AxiosError } from "axios";
import Router from "next/router";
import { PropsWithChildren, useContext } from "react";
import { MdLogout, MdSettings } from "react-icons/md";
import HamburgerMenu from "./hamburgerMenu";

const Page = (
  props: PropsWithChildren<{ backButton?: boolean; menu?: boolean }>
) => {
  const { addMessage } = useContext(FreelanceToolContext);

  const showMenu = props.menu === undefined || props.menu;

  return (
    <>
      <div className="flex flex-row items-center w-full h-9 relative">
        {props.backButton ? (
          <button className="neutral-button ml-2" onClick={Router.back}>
            Back
          </button>
        ) : (
          <></>
        )}

        {showMenu ? (
          <HamburgerMenu
            className="ml-auto"
            entries={[
              {
                name: "Settings",
                icon: MdSettings,
                onClick: async () => {
                  await Router.push("/settings");
                },
              },
              {
                name: "Log out",
                icon: MdLogout,
                onClick: async () => {
                  try {
                    await axios.get("/api/logout");
                    await Router.push("/login");
                  } catch (error) {
                    addMessage(
                      (
                        (error as AxiosError).response?.data as {
                          response: string;
                        }
                      ).response || "Unknown error",
                      "error"
                    );
                  }
                },
              },
            ]}
          />
        ) : (
          <></>
        )}
      </div>
      {props.children}
    </>
  );
};

export default Page;
