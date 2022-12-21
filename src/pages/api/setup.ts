import { SettingsData } from "@components/forms/settingsForm";
import prisma from "@lib/db";
import logger from "@lib/logger";
import { createUser } from "@lib/user";
import { withSessionRoute } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

interface SetupApiRequest extends NextApiRequest {
  body: SettingsData;
}

const setupRoute = async (req: SetupApiRequest, res: NextApiResponse) => {
  if (await prisma.userData.count()) {
    logger.error("Tried to setup initial user but a user already exists");
    return res.status(400).send({ response: "A user already exists" });
  }

  if (req.body.zip) {
    // Text input of type number still provides number as string
    req.body.zip = Number(req.body.zip);
  }

  if (!req.body.country) {
    req.body.country = "de";
  }

  try {
    await createUser(req.body);
    return res.status(200).send({ response: "Success" });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).send({ response: "Internal Server Error" });
  }
};

export default withSessionRoute(setupRoute);
