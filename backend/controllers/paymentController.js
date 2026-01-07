const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const Product = require('../models/productModel')
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendMail')

const vnpay_return = async (req, res) => {
  let vnp_Params = req.query;

  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = process.env.VNP_HASH_SECRET;

  const querystring = require('qs');
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {

    const orderCode = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];
    const transactionId = vnp_Params['vnp_TransactionNo'];

    if (rspCode !== '00') {
      // Giao dịch thất bại
      // Redirect về trang thất bại của Frontend
      return res.redirect(`${process.env.CLIENT_URL}/order-failed?code=${orderCode}`);
    }

    try {
      const order = await Order.findOne({ orderCode: orderCode });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      //Cập nhật trạng thái Order
      order.orderStatus = 'shipping'
      order.paymentStatus = 'paid';
      order.transactionId = transactionId;
      order.paidAt = new Date();
      const savedOrder = await order.save();

      const payment = await Payment.findOne({ orderId: order._id });
      if (payment) {
        payment.status = 'success';
        payment.transactionCode = transactionId;
        await payment.save();
      }

      await sendMailPaidSuccess(savedOrder)

      // Cập nhật số lượng hàng trong kho
      for (const item of savedOrder.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity, soldCount: item.quantity }
        });
      }

      return res.redirect(`${process.env.CLIENT_URL}/order-success?code=${orderCode}`);

    } catch (error) {
      console.error("Lỗi cập nhật đơn hàng:", error);
      return res.redirect(`${process.env.CLIENT_URL}/order-error?code=${orderCode}`);
    }

  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
};

// Hàm sắp xếp tham số (Bắt buộc phải có để tính hash đúng)
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const momo_return = async (req, res) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature
  } = req.query;

  const secretKey = process.env.MOMO_SECRET_KEY;
  const accessKey = process.env.MOMO_ACCESS_KEY;

  // Quan trọng: Phải đúng thứ tự như tài liệu Momo quy định
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const crypto = require('crypto');
  const signed = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  if (signature === signed) {

    if (resultCode == '0') {
      try {
        // Tìm đơn hàng (orderId của Momo chính là orderCode gửi đi)
        const order = await Order.findOne({ orderCode: orderId });

        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = 'shipping'
        order.paymentStatus = 'paid';
        order.transactionId = transId;
        order.paidAt = new Date();
        const savedOrder = await order.save();


        const payment = await Payment.findOne({ orderId: order._id });
        if (payment) {
          payment.status = 'success';
          payment.transactionCode = transId;
          await payment.save();
        }

        await sendMailPaidSuccess(savedOrder)

        for (const item of savedOrder.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stockQuantity: -item.quantity, soldCount: item.quantity }
          });
        }

        return res.redirect(`${process.env.CLIENT_URL}/order-success?code=${orderId}`);

      } catch (error) {
        return res.redirect(`${process.env.CLIENT_URL}/order-error?code=${orderId}`);
      }

    } else {
      // GIAO DỊCH THẤT BẠI
      return res.redirect(`${process.env.CLIENT_URL}/order-error?code=${orderId}`);
    }

  } else {
    // CHỮ KÝ KHÔNG KHỚP
    console.log("Momo Signature Mismatch!");
    res.status(400).json({ message: "Bad Request: Signature mismatch" });
  }
};

const sendMailPaidSuccess = async (savedOrder) => {
  const message = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Thanh toán thành công - Liquid Shop</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:28px; background:#16a34a; border-radius:8px 8px 0 0;" align="center">
              <h1 style="margin:0; color:#ffffff;">Liquid Shop</h1>
              <p style="margin:6px 0 0; color:#dcfce7; font-size:14px;">
                Thanh toán thành công
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#14532d; margin-top:0;">
                Thanh toán của bạn đã hoàn tất ✅
              </h2>

              <p style="color:#334155; font-size:15px;">
                Xin chào <strong>${savedOrder.customerInfo.fullName}</strong>,<br/>
                Chúng tôi đã <strong>nhận được thanh toán</strong> cho đơn hàng của bạn tại
                <strong>Liquid Shop</strong>.
              </p>

              <!-- Payment Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; font-size:14px;">
                <tr>
                  <td><strong>Mã đơn hàng:</strong></td>
                  <td>${savedOrder.orderCode}</td>
                </tr>
                <tr>
                  <td><strong>Phương thức thanh toán:</strong></td>
                  <td>${savedOrder.paymentMethod}</td>
                </tr>
                <tr>
                  <td><strong>Trạng thái thanh toán:</strong></td>
                  <td style="color:#16a34a; font-weight:bold;">
                    Đã thanh toán
                  </td>
                </tr>
                <tr>
                  <td><strong>Thời gian thanh toán:</strong></td>
                  <td>${new Date().toLocaleString('vi-VN')}</td>
                </tr>
              </table>

              <!-- Amount -->
              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:16px; margin:20px 0;">
                <p style="margin:0; font-size:15px; color:#14532d;">
                  <strong>Tổng số tiền đã thanh toán:</strong>
                </p>
                <p style="margin:8px 0 0; font-size:20px; font-weight:bold; color:#16a34a;">
                  ${savedOrder.totalAmount.toLocaleString('vi-VN')}₫
                </p>
              </div>

              <!-- Next Step -->
              <h3 style="color:#0f172a;">Bước tiếp theo</h3>
              <p style="color:#334155; font-size:14px; line-height:1.6;">
                Đơn hàng của bạn hiện đang được <strong>xử lý</strong> và sẽ sớm được bàn giao
                cho đơn vị vận chuyển. Chúng tôi sẽ tiếp tục cập nhật trạng thái đơn hàng
                qua email.
              </p>

              <!-- Shipping Address -->
              <h3 style="color:#0f172a;">Địa chỉ giao hàng</h3>
              <p style="color:#334155; font-size:14px; line-height:1.6;">
                ${savedOrder.customerInfo.shippingAddress.street},<br/>
                ${savedOrder.customerInfo.shippingAddress.ward},
                ${savedOrder.customerInfo.shippingAddress.district},<br/>
                ${savedOrder.customerInfo.shippingAddress.city}
              </p>

              <p style="margin-top:30px; color:#64748b; font-size:14px;">
                Nếu bạn có bất kỳ câu hỏi nào liên quan đến thanh toán hoặc đơn hàng,
                vui lòng liên hệ bộ phận hỗ trợ của Liquid Shop.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px; background:#f1f5f9; border-radius:0 0 8px 8px;">
              <p style="margin:0; color:#64748b; font-size:13px;">
                © ${new Date().getFullYear()} Liquid Shop. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await sendEmail({
    to: savedOrder.customerInfo.email,
    subject: 'Payment successful',
    html: message
  })
}

module.exports = { momo_return, vnpay_return };