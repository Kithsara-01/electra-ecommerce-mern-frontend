import { jsPDF } from "jspdf";

const formatPrice = (amount = 0) => {
  return `LKR ${Number(amount).toLocaleString()}`;
};

export const downloadInvoice = (order) => {
  const doc = new jsPDF();

  let y = 20;

  // ===================================
  // Company
  // ===================================
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ELECTRA", 20, y);

  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Online Electronic Items Management System", 20, y);

  y += 15;

  // ===================================
  // Invoice
  // ===================================
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 20, y);

  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Invoice No : ${order._id}`, 20, y);
  y += 7;

  doc.text(
    `Date : ${new Date(order.createdAt).toLocaleDateString()}`,
    20,
    y
  );

  y += 12;

  // ===================================
  // Customer
  // ===================================
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(`Name : ${order.customerName}`, 20, y);
  y += 7;

  doc.text(`Email : ${order.email}`, 20, y);
  y += 7;

  doc.text(`Phone : ${order.phone}`, 20, y);
  y += 7;

  doc.text(`Address : ${order.deliveryAddress}`, 20, y);

  y += 15;

  // ===================================
  // Products
  // ===================================
  doc.setFont("helvetica", "bold");
  doc.text("Products", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  order.items.forEach((item) => {
    doc.text(
      `${item.name}  |  Qty: ${item.quantity}  |  ${formatPrice(
        item.price
      )}`,
      20,
      y
    );

    y += 7;
  });

  y += 8;

  // ===================================
  // Totals
  // ===================================
  doc.setFont("helvetica", "bold");

  doc.text(`Subtotal : ${formatPrice(order.subtotal)}`, 20, y);
  y += 7;

  doc.text(`Delivery : ${formatPrice(order.deliveryFee)}`, 20, y);
  y += 7;

  doc.text(`Discount : ${formatPrice(order.discount)}`, 20, y);
  y += 10;

  doc.setFontSize(15);
  doc.text(
    `Grand Total : ${formatPrice(order.grandTotal)}`,
    20,
    y
  );

  y += 12;

  doc.setFontSize(11);

  doc.text(
    `Payment Method : ${order.paymentMethod}`,
    20,
    y
  );

  y += 15;

  doc.setFont("helvetica", "italic");
  doc.text(
    "Thank you for shopping with ELECTRA.",
    20,
    y
  );

  doc.save(`Invoice-${order._id}.pdf`);
};