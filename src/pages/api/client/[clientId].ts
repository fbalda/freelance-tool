import prisma from "@lib/db";
import { withSessionRouteProtected } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

// TODO: Put client ID in request body instead of query
const clientDataRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.clientId) {
    return res.status(400).send({ response: "Invalid client id" });
  }

  const clientId = req.query.clientId as string;

  // TODO: Paginate
  const workHours = await prisma.workHours.findMany({
    where: {
      clientId,
    },
    orderBy: {
      date: "desc",
    },
  });

  // TODO: Paginate
  return res.status(200).send(workHours);
};

export default withSessionRouteProtected(clientDataRoute);
