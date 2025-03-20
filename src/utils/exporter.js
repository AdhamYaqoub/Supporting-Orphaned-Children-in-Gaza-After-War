const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

// دالة تصدير البيانات إلى CSV
const exportToCSV = async (data) => {
    const json2csvParser = new Parser();
    return json2csvParser.parse(data);
};

// دالة تصدير البيانات إلى PDF
const exportToPDF = async (data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];
        
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err) => reject(err));

        doc.fontSize(14).text("Donations Report", { align: "center" }).moveDown();
        
        data.forEach((donation, index) => {
            doc.fontSize(12).text(`${index + 1}. Name: ${donation.name}, Amount: ${donation.amount}, Date: ${donation.date}`);
        });

        doc.end();
    });
};

module.exports = { exportToCSV, exportToPDF };
