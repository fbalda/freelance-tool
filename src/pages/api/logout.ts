import { NextApiRequest, NextApiResponse } from "next";

import { withSessionRoute } from "@lib/withSession";

const logoutRoute = (req: NextApiRequest, res: NextApiResponse) => {
  req.session.destroy();
  res.status(200).send({ response: "Success" });
};

export default withSessionRoute(logoutRoute);
