import prisma from "@lib/db";
import renderInvoice, { InvoiceData } from "@lib/invoices";
import { withSessionRouteProtected } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";

const createInvoicesRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const now = new Date();

  const currentMonthDate = new Date(now.getFullYear(), now.getMonth());
  const lastMonthDate = new Date(
    now.getFullYear(),
    // Month -1 is December of previous year, so this works
    now.getMonth() - 1
  );

  const workHours = await prisma.workHours.findMany({
    where: {
      client: { userDataId: req.session.userId },
      date: { gte: lastMonthDate, lt: currentMonthDate },
    },
  });

  const workByClients = new Map<string, InvoiceData>();

  workHours.forEach((wh) => {
    let data = workByClients.get(wh.clientId);

    if (!data) {
      data = {
        hoursByRate: new Map<number, number>(),
        clientId: wh.clientId,
        invoiceDate: new Date(),
        serviceDate: new Date(),
      };
      workByClients.set(wh.clientId, data);
    }

    data.hoursByRate.set(
      wh.rate,
      (data.hoursByRate.get(wh.rate) || 0) + wh.hours
    );
  });

  const docs: Promise<Buffer>[] = [];

  workByClients.forEach((clientData) => {
    docs.push(renderInvoice(req.session.userId, clientData, 0));
  });

  if (docs.length > 0) {
    const buffer = await docs[0];

    const transport = createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailMessage = {
      from: process.env.DEBUG_SENDER_EMAIL,
      to: process.env.DEBUG_RECEIVER_EMAIL,
      subject: "Invoice Test",
      text: "",
      attachments: [{ content: buffer, filename: "invoice.pdf" }],
    };

    await transport.sendMail(mailMessage);

    return res
      .setHeader("Content-Type", "application/pdf")
      .setHeader("Content-Length", buffer.length)
      .status(200)
      .send(buffer);
  }

  return res.status(200).send({ response: "swag" });
};

export default withSessionRouteProtected(createInvoicesRoute);
