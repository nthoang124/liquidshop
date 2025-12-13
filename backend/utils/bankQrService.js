exports.generateVietQR = (order) => {
  const bankId = process.env.BANK_ID
  const accountNo = process.env.ACCOUNT_NO
  const template = process.env.TEMPLATE

  const content = `THANHTOAN ${order.orderCode}`;
  const amount = order.totalAmount;

  // Tạo link ảnh QR
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;

  return qrUrl;
}