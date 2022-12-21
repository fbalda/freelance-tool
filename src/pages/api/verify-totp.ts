import logger from "@lib/logger";
import { getUserById, validateTotp } from "@lib/user";
import { withSessionRoute } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const totpTimeout = 1000 * 60; // 1 minute in ms

interface VerifyTotpApiRequest extends NextApiRequest {
  body: {
    totp: string;
  };
}

const totpRoute = async (req: VerifyTotpApiRequest, res: NextApiResponse) => {
  if (!req.session.userId) {
    // User did not yet sign in with credentials
    req.session.destroy();
    return res.status(401).send("Unauthorized");
  }

  if (
    !req.session.logInTimestamp ||
    Date.now() - req.session.logInTimestamp >= totpTimeout
  ) {
    // Login timed out
    req.session.destroy();
    return res.status(401).send("Unauthorized");
  }

  const totp = req.body.totp;

  try {
    const user = await getUserById(req.session.userId);

    if (user && validateTotp(user, totp)) {
      // Logged in successfully
      req.session.userId = user.id;
      req.session.authorized = true;
      req.session.logInTimestamp = Date.now();
      await req.session.save();
      res.status(200).send("Success");
    } else {
      // Invalid credentials - unauthorized
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    // Unexpected error
    logger.error((error as Error).message);
    return res.status(500).send("Internal Server Error");
  }
};

export default withSessionRoute(totpRoute);
