import fs from "fs";
import PDFDocument from "pdfkit";
import {Invoice} from "../../../shared/api/data/types";

const margin = 30;
const marginx = 50;
const lineMargin = 15;

let top = margin;
let path = ""; // PATH TO PDF FILE.

export let invoice;

// invoiceData = {
//   buyer: {
//     name: displayableName(
//       purchase.createdByProfile.firstName,
//       purchase.createdByProfile.lastName
//     ),
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     postal_code: "",
//     safe_address: purchase.createdByAddress,
//   },
//   seller: {
//     name: displayableName(sellerProfile.firstName, sellerProfile.lastName),
//     address: "Reifenstuehlstr. 9",
//     city: "München",
//     state: "",
//     country: "Deutschland",
//     postal_code: "80469",
//     safe_address: sellerProfile.circlesAddress,
//     phone: "089-38466851",
//     email: "lab@circles.name",
//   },
//   items: purchase.lines,
//   salesTax: [],
//   subtotal: purchase.total,
//   timeCirclesTotal: purchase.total,
//   invoice_nr: purchase.id,
//   invoice_date: dayjs(purchase.createdAt).format("DD.MM.YYYY"),
//   transferTime: "TBD",
//   transactionHash: "TBD",
// };

function createInvoice(invoice: {
  invoice_nr: string,
  invoice_date: string,
  transferTime: string,
  transactionHash: string,
  salesTax: {
    name: string,
    value: number
  }[],
  subtotal: number,
  timeCirclesTotal: number,
  buyer: {
    postal_code: string, name: string, address: string, city: string, country: string, safe_address: string
  },
  seller: {
    postal_code: string, name: string, address: string, city: string, country: string, safe_address: string
  },
  items: {
    amount: number
    offer: {
      title: string,
      pricePerUnit: number
    }
  }[]
}, path) {
  let doc = new PDFDocument({
    size: "A4",
    margins: { top: margin, left: margin, bottom: 10, right: 50 },
  });

  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateSubtotalTable(doc, invoice);
  generateTransactionMetaData(doc, invoice);
  generateFooter(doc, invoice);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function newPageCheck(doc, invoice, itemsHeader = false) {
  if (top > 730) {
    generateFooter(doc, invoice);
    doc.addPage();
    top = margin;
    if (itemsHeader) {
      doc
        .rect(0, top, doc.page.width, 28)
        .fill("#F8F8FA")
        .font("Helvetica-Bold")
        .fillColor("#333333");
      generateTableRow(doc, top + 10, "ITEM", "QTY", "COST", "PRICE");
      top += 50;
    }
  }
}

function generateHeader(doc, invoice) {
  let sectionTop = top;
  doc
    .rect(0, 0, doc.page.width, 120)
    .fill("#F8F8FA")
    .image("logo.png", marginx, top, { width: 134 })
    .fillColor("#333333")
    .fontSize(20)
    .text("Invoice", 300, top)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Invoice Number", 300, (top += 30))
    .font("Helvetica")
    .fillColor("#000000")
    .text(invoice.invoice_nr, 300, (top += lineMargin))

    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text("Date", 300, (sectionTop += 30), { align: "right" })
    .font("Helvetica")
    .fillColor("#000000")
    .text(invoice.invoice_date, 300, (sectionTop += lineMargin), {
      align: "right",
    })

    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  let sectionTop = (top += 70);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text("Bill to:", 50, top)
    .font("Helvetica")
    .fillColor("#000000")
    .text(invoice.buyer.name, marginx, (top += lineMargin))
    .text(invoice.buyer.address, marginx, (top += lineMargin))
    .text(
      `${invoice.buyer.postal_code} ${invoice.buyer.city}`,
      marginx,
      (top += lineMargin)
    )
    .text(invoice.buyer.country, marginx, (top += lineMargin))

    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text("Safe Address:", marginx, (top += 20))
    .font("Helvetica")
    .fillColor("#000000")
    .fontSize(8)
    .text(invoice.buyer.safe_address, marginx, (top += lineMargin))

    // Seller
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text("Bill From:", 300, sectionTop)
    .font("Helvetica")
    .fillColor("#000000")
    .text(invoice.seller.name, 300, (sectionTop += lineMargin))
    .text(invoice.seller.address, 300, (sectionTop += lineMargin))
    .text(
      `${invoice.seller.postal_code} ${invoice.buyer.city}`,
      300,
      (sectionTop += lineMargin)
    )
    .text(invoice.seller.country, 300, (sectionTop += lineMargin))

    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text("Safe Address:", 300, (sectionTop += 20))
    .font("Helvetica")
    .fillColor("#000000")
    .fontSize(8)
    .text(invoice.seller.safe_address, 300, (sectionTop += lineMargin))

    .moveDown();
}

function generateSubtotalTable(doc, invoice) {
  if (top > 680) {
    doc.addPage();
    top = margin;
  }

  doc
    .strokeColor("#333333")
    .lineWidth(1)
    .moveTo(300, (top += 20))
    .lineTo(550, top)
    .stroke();

  newPageCheck(doc, invoice);

  top += 10;

  if (invoice.salesTax && invoice.salesTax.length) {
    invoice.salesTax.forEach((taxRow, index) => {
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#333333")

        .text(
          `VAT ${taxRow.name}% (included)`,
          300,
          index == 0 ? top : (top += 20),
          {
            width: 100,
            align: "left",
          }
        )
        .text(formatCurrency(taxRow.value), 0, top, {
          align: "right",
        });
    });
    top += 20;
  }

  newPageCheck(doc, invoice);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#333333")

    .text("Invoice Total", 300, top, { width: 70, align: "left" })
    .text(formatCurrency(invoice.subtotal), 0, top, { align: "right" });

  newPageCheck(doc, invoice);

  // doc
  //   .fontSize(10)
  //   .font("Helvetica")
  //   .fillColor("#333333")

  //   .text("Paid (Euro)", 300, (top += 20), { width: 70, align: "left" })
  //   .text(`-${formatCurrency(invoice.subtotal)}`, 0, top, { align: "right" });
  // if (top > 680) {
  //   doc.addPage();
  //   top = margin;
  // }

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#333333")

    .text("Paid (Time Circles)", 300, (top += 20), {
      width: 100,
      align: "left",
    })
    .text(`-${invoice.timeCirclesTotal} c`, 0, top, {
      align: "right",
    })
    .moveDown();

  newPageCheck(doc, invoice);

  doc
    .strokeColor("#333333")
    .lineWidth(1)
    .moveTo(300, (top += 20))
    .lineTo(550, top)
    .stroke();

  newPageCheck(doc, invoice);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#333333")

    .text("Amount due", 300, (top += 10), { width: 70, align: "left" })
    .text(formatCurrency(0), 0, top, { align: "right" });

  newPageCheck(doc, invoice);
}

function generateTransactionMetaData(doc, invoice) {
  top += 40;
  newPageCheck(doc, invoice);

  doc
    .rect(0, top - 10, doc.page.width, 90)
    .fill("#F8F8FA")
    .font("Helvetica-Bold")
    .fillColor("#333333")

    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text("Transaction Time", marginx, top)
    .font("Helvetica")
    .fillColor("#000000")
    .text(invoice.transferTime, marginx, (top += lineMargin))

    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text("Transaction Hash", marginx, (top += 20))
    .font("Helvetica")
    .fillColor("#000000")
    .text(invoice.transactionHash, marginx, (top += lineMargin));
}

function generateInvoiceTable(doc, invoice) {
  let i;
  top += 40;
  doc
    .rect(0, top - 10, doc.page.width, 30)
    .fill("#F8F8FA")
    .font("Helvetica-Bold")
    .fillColor("#333333");
  generateTableRow(doc, top, "ITEM", "QTY", "COST", "PRICE");

  top += 5;
  newPageCheck(doc, invoice);

  top += 5;
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];

    top += 20;
    newPageCheck(doc, invoice, true);

    generateTableRow(
      doc,
      top,
      item.offer.title,
      item.amount,
      item.offer.pricePerUnit,
      // formatCurrency(item.amount * item.offer.pricePerUnit)
      item.amount * item.offer.pricePerUnit
    );
    if (top > 680) {
      generateFooter(doc, invoice);
    }
  }
}

function generateFooter(doc, invoice) {
  doc
    .font("Helvetica")
    .fontSize(8)
    .text(
      "Basic Income Lab GmbH | Reifenstuelstr. 6 | 80469 München",
      50,
      790,
      { align: "center", width: 500 }
    )

    .text("Tel.: 089-38466851 | lab@circles.name.", 50, 800, {
      align: "center",
      width: 500,
    })

    .text(
      "Bankverbindung: IBAN DE19110101015407699323 | BIC SOBKDEB2XXX | Penta Bank USt.-ID: DE32/271/3268",
      50,
      810,
      { align: "center", width: 500 }
    )
    .text(
      "HRB 269232 | Registergericht: München | Geschäftsführung: Samuel Andert ",
      50,
      820,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,

  unitCost,
  quantity,

  lineTotal
) {
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#333333")
    .text(item, 50, y)
    .font("Helvetica")
    .text(unitCost, 300, y, { width: 70, align: "left" })
    .text(quantity, 370, y, { width: 90, align: "left" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount) {
  return amount + " €";
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice,
};
