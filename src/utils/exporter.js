const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const ExcelJS = require('exceljs');

// دالة تصدير البيانات إلى XLSX
const exportToExcel = async (donations) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Donations");

  
  // تعريف الأعمدة
  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Category", key: "category", width: 20 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Created At", key: "created_at", width: 20 }
  ];

  // إضافة البيانات
  donations.forEach((donation) => {
    worksheet.addRow({
      id: donation.id,
      category: donation.category,
      amount: donation.amount,
      created_at: donation.created_at
    });
  });

  // تصدير إلى buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

// دالة تصدير البيانات إلى PDF
const exportToPDF = async (donations) => {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(18).text("Donation Report", { align: "center" });
  doc.moveDown();

  donations.forEach((donation, index) => {
    doc.fontSize(12).text(`Donation #${index + 1}`);
    doc.text(`ID: ${donation.id}`);
    doc.text(`Category: ${donation.category || "-"}`);
    doc.text(`Amount: ${donation.amount || "-"}`);

    // تأكد من تحويل التاريخ إلى نص
    const createdAt = donation.created_at ? new Date(donation.created_at).toLocaleString() : "-";
    doc.text(`Created At: ${createdAt}`);

    doc.moveDown();
  });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);
  });
};

module.exports = { exportToExcel, exportToPDF };
