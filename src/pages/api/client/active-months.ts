import prisma from "@lib/db";
import { withSessionRouteProtected } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

interface ClientActiveMonthsApiRequest extends NextApiRequest {
  body: {
    clientId?: string;
  };
}

export interface YearMonths {
  year: number;
  months: number[];
}

const clientActiveMonthRoute = async (
  req: ClientActiveMonthsApiRequest,
  res: NextApiResponse
) => {
  if (!req.body.clientId) {
    return res.status(400).send({ response: "Invalid client id" });
  }

  const clientId = req.body.clientId;

  // TODO: Find a more elegant/performant solution
  const workHourDates = await prisma.workHours.findMany({
    where: {
      clientId,
    },
    orderBy: {
      date: "desc",
    },
    select: {
      date: true,
    },
  });

  const months = new Map<number, Set<number>>();

  workHourDates.forEach((dateObject) => {
    const month = dateObject.date.getMonth();
    const year = dateObject.date.getFullYear();

    let mapYear = months.get(year);

    if (!mapYear) {
      mapYear = new Set<number>();
      months.set(year, mapYear);
      mapYear = months.get(year);

      if (!mapYear) {
        // This should never happen, just to satisfy typescript/eslint
        return;
      }
    }

    mapYear.add(month);
  });

  const formattedDates: YearMonths[] = [];

  months.forEach((months, year) => {
    formattedDates.push({
      year,
      months: Array.from(months),
    });
  });

  // TODO: Paginate
  return res.status(200).send(formattedDates);
};

export default withSessionRouteProtected(clientActiveMonthRoute);
