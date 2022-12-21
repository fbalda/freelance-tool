import { NextApiRequest, NextApiResponse } from "next";

import { SettingsData } from "@components/forms/settingsForm";
import logger from "@lib/logger";
import { updateSettings } from "@lib/user";
import { withSessionRouteProtected } from "@lib/withSession";

interface UpdateSettingsApiRequest extends NextApiRequest {
  body: Partial<SettingsData>;
}

const setupRoute = async (
  req: UpdateSettingsApiRequest,
  res: NextApiResponse
) => {
  if (req.body.zip) {
    // Text input of type number still provides number as string
    req.body.zip = Number(req.body.zip);
  }

  if (!req.body.country) {
    req.body.country = "de";
  }

  try {
    await updateSettings(req.session.userId, req.body);
    return res.status(200).send({ response: "Success" });
  } catch (error: unknown) {
    logger.error((error as Error).message);
    return res.status(400).send({ response: (error as Error).message });
  }
};

export default withSessionRouteProtected(setupRoute);
