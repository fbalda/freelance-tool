import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/db";
import logger from "@lib/logger";
import { withSessionRouteProtected } from "@lib/withSession";

interface DeleteWorkHoursApiRequest extends NextApiRequest {
  body: {
    workHoursId: string;
  };
}

const deleteWorkHoursRoute = async (
  req: DeleteWorkHoursApiRequest,
  res: NextApiResponse
) => {
  const id = req.body.workHoursId;

  try {
    await prisma.workHours.delete({
      where: {
        id,
      },
    });

    return res.status(200).send({ response: "Success" });
  } catch (error) {
    logger.error((error as Error).message);
    return res.status(500).send({ response: "Internal Server Error" });
  }
};

export default withSessionRouteProtected(deleteWorkHoursRoute);
