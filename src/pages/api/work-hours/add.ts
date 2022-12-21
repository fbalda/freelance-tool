import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/db";
import logger from "@lib/logger";
import { withSessionRoute } from "@lib/withSession";
import { WorkHours } from "@prisma/client";

interface AddWorkHoursApiRequest extends NextApiRequest {
  body: WorkHours;
}

const addWorkHoursRoute = async (
  req: AddWorkHoursApiRequest,
  res: NextApiResponse
) => {
  if (!req.session.authorized) {
    return res.status(401).send({ response: "Unauthorized" });
  }

  if (req.body.hours) {
    // Text input of type number still provides number as string
    req.body.hours = Number(req.body.hours);
  }

  if (req.body.rate) {
    // Text input of type number still provides number as string
    req.body.rate = Number(req.body.rate);
  }

  if (req.body.date) {
    // Text input of type number still provides number as string
    req.body.date = new Date(req.body.date);
  }

  try {
    await prisma.workHours.create({ data: req.body });
    return res.status(200).send({ response: "Success" });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ response: "Internal Server Error" });
  }
};

export default withSessionRoute(addWorkHoursRoute);
