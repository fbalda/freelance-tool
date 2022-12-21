import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/db";
import logger from "@lib/logger";
import { withSessionRouteProtected } from "@lib/withSession";
import { WorkHours } from "@prisma/client";

interface ModifyWorkHoursApiRequest extends NextApiRequest {
  body: WorkHours;
}

const modifyWorkHoursRoute = async (
  req: ModifyWorkHoursApiRequest,
  res: NextApiResponse
) => {
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
    await prisma.workHours.update({
      where: { id: req.body.id },
      data: req.body,
    });
    return res.status(200).send({ response: "Success" });
  } catch (error) {
    logger.error((error as { message: string }).message);
    return res.status(500).send({ response: "Internal Server Error" });
  }
};

export default withSessionRouteProtected(modifyWorkHoursRoute);
