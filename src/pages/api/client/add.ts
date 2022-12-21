import prisma from "@lib/db";
import logger from "@lib/logger";
import { withSessionRouteProtected } from "@lib/withSession";
import { Client } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface AddClientApiRequest extends NextApiRequest {
  body: Omit<Client, "id" | "clientNumber"> & {
    clientNumber?: number;
  };
}

const addClientRoute = async (
  req: AddClientApiRequest,
  res: NextApiResponse
) => {
  req.body.userDataId = req.session.userId;

  if (!req.body.country) {
    // Default country to germany
    req.body.country = "de";
  }

  if (req.body.zip) {
    // Text input of type number still provides number as string
    req.body.zip = Number(req.body.zip);
  }

  if (req.body.clientNumber) {
    req.body.clientNumber = Number(req.body.clientNumber);
  } else {
    req.body.clientNumber = undefined;
  }

  try {
    await prisma.client.create({ data: req.body });
    return res.status(200).send({ response: "Success" });
  } catch (error) {
    logger.error((error as { message: string }).message);
    return res.status(500).send({ response: "Internal Server Error" });
  }
};

export default withSessionRouteProtected(addClientRoute);
