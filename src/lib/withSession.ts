import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";

declare module "iron-session" {
  interface IronSessionData {
    userId: string;
    authorized: boolean;
    logInTimestamp?: number;
  }
}

const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET || "",
  cookieName: process.env.SESSION_COOKIE_NAME || "",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const withSessionRoute = (handler: NextApiHandler) => {
  return withIronSessionApiRoute(handler, sessionOptions);
};

export const withSessionRouteProtected = (handler: NextApiHandler) => {
  return withSessionRoute(async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.session.authorized) {
      return res.status(401).send("Unauthorized");
    }

    await handler(req, res);
  });
};

export const withSessionSsr = <
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => {
  return withIronSessionSsr(handler, sessionOptions);
};

export const withSessionSsrProtected = <
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => {
  return withSessionSsr((context) => {
    if (!context.req.session.authorized) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return handler(context);
  });
};
