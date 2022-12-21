import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/db";
import { withSessionRouteProtected } from "@lib/withSession";
import { Client } from "@prisma/client";

type ClientData = Client & {
  lastMonthHours: number;
  lastMonthRevenue: number;
  currentMonthHours: number;
  currentMonthRevenue: number;
};

const clientsRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const clients = await prisma.client.findMany({
    where: { userDataId: req.session.userId },
  });

  const now = new Date();

  const currentMonthDate = new Date(now.getFullYear(), now.getMonth());
  const lastMonthDate = new Date(
    now.getFullYear(),
    // Month -1 is December of previous year, so this works
    now.getMonth() - 1
  );

  const output: ClientData[] = [];

  for (let i = 0; i < clients.length; i++) {
    // Get current month's work
    const workCurrentMonth = await prisma.workHours.findMany({
      where: { client: clients[i], date: { gte: currentMonthDate } },
    });

    const hoursRevenueCurrentMonth = workCurrentMonth.reduce<{
      hours: number;
      revenue: number;
    }>(
      (previousValue, currentValue) => {
        return {
          hours: previousValue.hours + currentValue.hours,
          revenue:
            previousValue.revenue + currentValue.hours * currentValue.rate,
        };
      },
      { hours: 0, revenue: 0 }
    );

    // Get last month's work
    const workLastMonth = await prisma.workHours.findMany({
      where: {
        client: clients[i],
        date: { gte: lastMonthDate, lt: currentMonthDate },
      },
    });

    const hoursRevenueLastMonth = workLastMonth.reduce<{
      hours: number;
      revenue: number;
    }>(
      (previousValue, currentValue) => {
        return {
          hours: previousValue.hours + currentValue.hours,
          revenue:
            previousValue.revenue + currentValue.hours * currentValue.rate,
        };
      },
      { hours: 0, revenue: 0 }
    );

    output.push({
      ...clients[i],
      lastMonthHours: hoursRevenueLastMonth.hours,
      lastMonthRevenue: hoursRevenueLastMonth.revenue,
      currentMonthHours: hoursRevenueCurrentMonth.hours,
      currentMonthRevenue: hoursRevenueCurrentMonth.revenue,
    });
  }

  // TODO: Paginate
  return res.status(200).send(output || []);
};

export default withSessionRouteProtected(clientsRoute);
