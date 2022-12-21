import PDFDocument from "pdfkit-table";
import prisma from "./db";

export interface InvoiceData {
  hoursByRate: Map<number, number>;
  clientId: string;
  invoiceDate: Date;
  serviceDate: Date;
}

const renderInvoice = async (
  userId: string,
  data: InvoiceData,
  invoiceIndex: number
) => {
  const user = await prisma.userData.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });

  if (!client) {
    throw new Error("Client found");
  }

  const doc = new PDFDocument({ size: "a4" });

  const buffers: Buffer[] = [];

  doc.on("data", buffers.push.bind(buffers));

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `${user.businessName}\n${user.street} ${user.houseNumber}\n` +
        `D-${user.zip} ${user.city}\n\nTelefon: ${user.phone}\n` +
        `E-Mail: ${user.email}\n\nDatum: ` +
        `${data.invoiceDate.toLocaleDateString(new Intl.Locale("de"))}\n\n` +
        `Rechnungsnummer: ${data.serviceDate.getFullYear()}${(
          "0" + data.serviceDate.getMonth().toString()
        ).slice(-2)}${("0000" + invoiceIndex.toString()).slice(
          -5
        )}\nKundennummer: ${("0000" + client.clientNumber.toString()).slice(
          -5
        )}`,
      { align: "right" }
    );

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `${client.fullName}\n${client.street} ${client.houseNumber}\n` +
        `D-${client.zip} ${client.city}`,
      undefined,
      130,
      {
        align: "left",
      }
    );

  doc.fontSize(14).font("Helvetica-Bold").text("Rechnung\n\n", undefined, 230);

  const rows: string[][] = [];

  let totalBeforeTax = 0;

  data.hoursByRate.forEach((val, key) => {
    totalBeforeTax += val * key;

    const rateString = key.toString().replace(/\./g, ",");
    const rateTotalString = (val * key).toString().replace(/\./g, ",");

    rows.push([
      "Softwareentwicklung",
      `${rateString}\u20ac`,
      `${val}`,
      `${rateTotalString}\u20ac`,
    ]);
  });

  const table = {
    title: "",
    headers: ["Beschreibung", "Einzelpreis", "Anzahl", "Gesamtpreis"],
    rows,
  };

  await doc
    .fontSize(12)
    .font("Helvetica")
    .table(table, {
      width: 450,
      columnsSize: [250, 75, 50, 75],
      padding: [0, 4],
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        if (rectCell && indexColumn !== 3) {
          doc
            .rect(rectCell.x, rectCell.y, rectCell.width, rectCell.height)
            .fill("#e5e5e5");
        }

        return doc
          .font("Helvetica")
          .fontSize(10)
          .font(indexRow === 2 ? "Helvetica-Bold" : "Helvetica")
          .fill("black");
      },
    });

  const tax = totalBeforeTax * 0.19;
  const total = totalBeforeTax + tax;

  const totalBeforeTaxString = totalBeforeTax.toString().replace(/\./g, ",");
  const taxString = tax.toString().replace(/\./g, ",");
  const totalString = total.toString().replace(/\./g, ",");

  const table2 = {
    title: "",
    headers: ["", "", ""],
    rows: [
      ["", "Nettobetrag", `${totalBeforeTaxString}\u20ac`],
      ["", "Zzgl. Umsatzsteuer 19%", `${taxString}\u20ac`],
      ["", "Gesamtbetrag", `${totalString}\u20ac`],
    ],
  };

  await doc
    .fontSize(12)
    .font("Helvetica")
    .table(table2, {
      hideHeader: true,
      width: 450,
      columnsSize: [250, 125, 75],
      padding: [0, 4],
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        if (rectCell && indexColumn !== 2) {
          doc
            .rect(rectCell.x, rectCell.y, rectCell.width, rectCell.height)
            .fill("#e5e5e5");
        }

        return doc
          .font("Helvetica")
          .fontSize(10)
          .font(indexRow === 2 ? "Helvetica-Bold" : "Helvetica")
          .fill("black");
      },
    });

  doc
    .fontSize(9)
    .font("Helvetica-Oblique")
    .text(
      `Leistungsdatum: ${data.serviceDate.toLocaleDateString(
        new Intl.Locale("de")
      )}`
    );

  doc.moveTo(50, 670).lineTo(545, 670).stroke("black");

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Bankverbindung", undefined, 700);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(
      `\nTest Bank\nIBAN: ${
        user.iban.match(/.{1,4}/g)?.join(" ") || ""
      }\nBIC: ${user.bic}`
    );

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Steuernummer", 120, 700, { width: 400, align: "right" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`\n${user.taxNumber}`, 120, undefined, {
      width: 400,
      align: "right",
    });

  const bufferPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });

  doc.end();

  return bufferPromise;
};

export default renderInvoice;
