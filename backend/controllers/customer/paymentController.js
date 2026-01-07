const Order = require('../../models/orderModel');
const Payment = require('../../models/paymentModel');
const vnpayService = require('../../utils/vnpayService');
const momoService = require('../../utils/momoService');
const bankService = require('../../utils/bankQrService');

const createPayment = async (req, res) => {
  const { orderCode, paymentMethod, paymentProvider } = req.body;
  const user = req.user

  if (paymentMethod != "COD" && paymentMethod != "BankTransfer" && paymentMethod != "OnlineGateway") {
    return res.status(400).json({
      message: "Payment method invalid"
    })
  }

  if (paymentMethod == "OnlineGateway" && paymentProvider != "VNPAY" && paymentProvider != "Momo") {
    return res.status(400).json({
      message: "Payment provider invalid"
    })
  }

  try {
    const order = await Order.findOne({ orderCode })

    if (!order || order.paymentStatus == 'paid' || order.paymentStatus == 'failed') {
      return res.status(400).json({
        message: "Order invalid"
      });
    }

    order.paymentMethod = paymentMethod;
    const savedOrder = await order.save();
    let paymentUrl = null;

    if (paymentMethod === 'OnlineGateway') {
      const newPayment = new Payment({
        orderId: savedOrder._id,
        userId: user._id,
        amount: savedOrder.totalAmount,
        method: paymentProvider,
        status: 'pending',
        transactionCode: null
      });
      await newPayment.save();

      if (paymentProvider === 'VNPAY') {
        paymentUrl = vnpayService.createPaymentUrl(req, savedOrder);
      }
      else if (paymentProvider === 'Momo') {
        paymentUrl = await momoService.createMomoPayment(savedOrder);
      }
    }
    else if (paymentMethod === 'BankTransfer') {
      paymentUrl = bankService.generateVietQR(savedOrder);
    }

    res.status(201).json({
      message: "Create payment successful",
      order: savedOrder,
      paymentUrl
    });

  } catch (error) {
    res.status(500).json({
      message: "Create payment error",
      error: error
    });
  }
};

module.exports = { createPayment }