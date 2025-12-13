// vnpayService.js
const moment = require('moment');

exports.createPaymentUrl = (req, order) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  const ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = order.orderCode;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang:' + order.orderCode;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = order.totalAmount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  // Sắp xếp tham số theo alphabet (Bắt buộc)
  vnp_Params = sortObject(vnp_Params);

  const querystring = require('qs');
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

  vnp_Params['vnp_SecureHash'] = signed;

  const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

  return paymentUrl;
}

// Hàm phụ trợ sắp xếp tham số
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