import prisma from "@lib/db";
import logger from "@lib/logger";
import { withSessionRouteProtected } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

interface DeleteClientApiRequest extends NextApiRequest {
  body: {
    clientId: string;
  };
}

const deleteClientRoute = async (
  req: DeleteClientApiRequest,
  res: NextApiResponse
) => {
  try {
    await prisma.client.delete({
      where: { id: req.body.clientId },
    });
    return res.status(200).send({ response: "Success" });
  } catch (error) {
    logger.error((error as { message: string }).message);
    return res.status(500).send({ response: "Internal Server Error" });
  }
};

export default withSessionRouteProtected(deleteClientRoute);
