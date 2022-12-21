import renderInvoice, { InvoiceData } from "@lib/invoices";
import { withSessionRouteProtected } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

interface CreateInvoiceApiRequest extends NextApiRequest {
  body: {
    month: string;
    clientId: string;
  };
}

export interface YearMonths {
  year: number;
  months: number[];
}

const createInvoiceRoute = async (
  req: CreateInvoiceApiRequest,
  res: NextApiResponse
) => {
  if (!req.body.clientId) {
    return res.status(400).send({ response: "Invalid client id" });
  }

  const splitStrings = req.body.month.split("/");

  const month = Number(splitStrings[0]);
  const year = Number(splitStrings[1]);

  if (!month || !year) {
    return res.status(400).send({ response: "Invalid month" });
  }

  const startDate = new Date(year, month);
  const endDate = new Date(year, month + 1);

  const client = await prisma.client.findUnique({
    where: {
      id: req.body.clientId,
    },
    include: {
      WorkHours: {
        where: {
          client: { id: req.body.clientId },
          date: { gte: startDate, lt: endDate },
        },
      },
    },
  });

  if (!client) {
    // This should never happen
    return res.status(500).send({ response: "Unexpected Error" });
  }

  const serviceDate = new Date();
  serviceDate.setDate(endDate.getDate() - 1);

  const invoiceData: InvoiceData = {
    hoursByRate: new Map<number, number>(),
    clientId: req.body.clientId,
    invoiceDate: new Date(),
    serviceDate: serviceDate,
  };
  client.WorkHours.forEach((wh) => {
    invoiceData.hoursByRate.set(
      wh.rate,
      (invoiceData.hoursByRate.get(wh.rate) || 0) + wh.hours
    );
  });

  let invoiceBuffer: Buffer = Buffer.from("");

  try {
    invoiceBuffer = await renderInvoice(
      req.session.userId,
      invoiceData,
      client.clientNumber
    );
  } catch (error) {
    return res.status(500).send({ response: (error as Error).message });
  }

  return res
    .setHeader("Content-Type", "application/pdf")
    .setHeader("Content-Length", invoiceBuffer.length)
    .status(200)
    .send(invoiceBuffer);
};

export default withSessionRouteProtected(createInvoiceRoute);
