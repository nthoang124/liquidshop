const crypto = require('crypto');
const axios = require('axios');

exports.createMomoPayment = async (order) => {
  // Config Test Momo
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const endpoint = process.env.MOMO_ENDPOINT;

  const orderId = order.orderCode;
  const requestId = orderId;
  const amount = order.totalAmount.toString();
  const orderInfo = "Thanh toan don hang " + orderId;
  const redirectUrl = "http://localhost:3000/payment/momo_return";
  const ipnUrl = "http://localhost:3000/payment/momo_ipn";
  // const requestType = "captureWallet";
  const requestType = "payWithATM";
  const extraData = "";

  // Tạo chữ ký (theo đúng format Momo yêu cầu)
  const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'vi'
  };

  try {
    const response = await axios.post(endpoint, requestBody);
    return response.data.payUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}