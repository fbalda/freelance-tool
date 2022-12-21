import { NextApiRequest, NextApiResponse } from "next";
import { getUserByUsername, validatePassword } from "../../lib/user";

import logger from "@lib/logger";
import { withSessionRoute } from "@lib/withSession";

interface LoginApiRequest extends NextApiRequest {
  body: {
    username: string;
    password: string;
  };
}

const loginRoute = async (req: LoginApiRequest, res: NextApiResponse) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await getUserByUsername(username);

    if (user && validatePassword(user, password)) {
      // Logged in successfully
      req.session.userId = user.id;
      req.session.logInTimestamp = Date.now();
      req.session.authorized = !user.totpsecret;

      await req.session.save();

      return res
        .status(200)
        .send({ response: "Success", requiresTotp: !!user.totpsecret });
    } else {
      // Invalid credentials - forbidden
      return res.status(403).send({ response: "Invalid credentials" });
    }
  } catch (error) {
    // Unexpected error
    logger.error((error as { message: string }).message);
    return res.status(500).send({ response: "Internal Server Error" });
  }
};

export default withSessionRoute(loginRoute);
