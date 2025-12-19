const Order = require('../../models/orderModel');
const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');
const Promotion = require('../../models/promotionModel');
const Payment = require('../../models/paymentModel');
const { sendEmail } = require('../../utils/sendMail')
const vnpayService = require('../../utils/vnpayService');
const momoService = require('../../utils/momoService');
const bankService = require('../../utils/bankQrService');

const createOrder = async (req, res) => {
  const { paymentMethod, paymentProvider, voucherCode, notes, items } = req.body;
  const userId = req.user.id

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
    const user = req.user
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart empty"
      });
    }

    const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
    if (!defaultAddress) {
      return res.status(400).json({
        message: "Please update your shipping address first"
      });
    }

    // Loop qua các item để lấy tổng tiền
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const exists = cart.items.some(
        i => i.productId.toString() === item.productId.toString()
      );

      if (!exists) {
        return res.status(400).json({
          message: "Product not found in cart"
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `The product  ${product.name} is out of stock`
        });
      }

      const price = product.price;
      const totalItemPrice = price * item.quantity;
      subtotal += totalItemPrice;

      orderItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: item.quantity,
        price: price
      });
    }

    // Chỗ này tính lại tiền theo voucher
    let discountAmount = 0;
    let voucherId = null;

    if (voucherCode) {
      const voucher = await Promotion.findOne({ code: voucherCode, isActive: true });

      if (!voucher) {
        return res.status(400).json({
          message: "Invalid discount code"
        });
      }

      const now = new Date();
      if (now < voucher.startDate || now > voucher.endDate) {
        return res.status(400).json({
          message: "Discount code expired"
        });
      }

      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        return res.status(400).json({
          message: "Discount code has reached its usage limit"
        });
      }

      if (subtotal < voucher.minOrderAmount) {
        return res.status(400).json({
          message: `Order does not meet minimum value ${voucher.minOrderAmount}`
        });
      }

      if (voucher.discountType === 'percentage') {
        discountAmount = (subtotal * voucher.discountValue) / 100;
        if (voucher.maxDiscountAmount && discountAmount > voucher.maxDiscountAmount) {
          discountAmount = voucher.maxDiscountAmount;
        }
      } else if (voucher.discountType === 'fixed_amount') {
        discountAmount = voucher.discountValue;
      }

      if (discountAmount > subtotal) discountAmount = subtotal;

      voucherId = voucher._id;
    }

    // shippingFee tạm tính = 0, sẽ sửa nếu có cập nhật về shippingFee =))
    const shippingFee = 0;
    const totalAmount = subtotal + shippingFee - discountAmount;

    const orderCode = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    // Tạo order
    const newOrder = new Order({
      orderCode: orderCode,
      userId: user._id,
      customerInfo: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        shippingAddress: {
          street: defaultAddress.street,
          ward: defaultAddress.ward,
          district: defaultAddress.district,
          city: defaultAddress.city
        }
      },
      items: orderItems,
      subtotal: subtotal,
      shippingFee: shippingFee,
      discountAmount: discountAmount,
      voucherCode: voucherCode || null,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending_confirmation',
      notes: notes
    });

    const savedOrder = await newOrder.save();

    let paymentUrl = null;

    if (paymentMethod === 'OnlineGateway') {
      // Tạo record Payment đồng bộ với order
      const newPayment = new Payment({
        orderId: savedOrder._id,
        userId: user._id,
        amount: totalAmount,
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
      // Với BankTransfer, URL là QR Link
      paymentUrl = bankService.generateVietQR(savedOrder);
    }

    // Cập nhật lại giỏ hàng, voucher, tồn kho
    await Cart.findOneAndDelete({ userId });

    if (voucherId) {
      await Promotion.findByIdAndUpdate(voucherId, { $inc: { usedCount: 1 } });
    }

    const message = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>Xác nhận đơn hàng - Liquid Shop</title>
    </head>
    <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">
            <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="padding:28px; background:#0f172a; border-radius:8px 8px 0 0;" align="center">
                  <h1 style="margin:0; color:#ffffff;">Liquid Shop</h1>
                  <p style="margin:6px 0 0; color:#cbd5e1; font-size:14px;">
                    Xác nhận đơn hàng của bạn
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:32px;">
                  <h2 style="color:#0f172a; margin-top:0;">
                    Đặt hàng thành công 🎉
                  </h2>

                  <p style="color:#334155; font-size:15px;">
                    Xin chào <strong>${savedOrder.customerInfo.fullName}</strong>,<br/>
                    Cảm ơn bạn đã mua sắm tại <strong>Liquid Shop</strong>.
                    Đơn hàng của bạn đã được tạo thành công với thông tin như sau:
                  </p>

                  <!-- Order Info -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; font-size:14px;">
                    <tr>
                      <td><strong>Mã đơn hàng:</strong></td>
                      <td>${savedOrder.orderCode}</td>
                    </tr>
                    <tr>
                      <td><strong>Ngày đặt:</strong></td>
                      <td>${new Date(savedOrder.createdAt).toLocaleString('vi-VN')}</td>
                    </tr>
                    <tr>
                      <td><strong>Trạng thái đơn:</strong></td>
                      <td>${savedOrder.orderStatus}</td>
                    </tr>
                    <tr>
                      <td><strong>Thanh toán:</strong></td>
                      <td>${savedOrder.paymentMethod} (${savedOrder.paymentStatus})</td>
                    </tr>
                  </table>

                  <!-- Shipping Address -->
                  <h3 style="color:#0f172a;">Địa chỉ giao hàng</h3>
                  <p style="color:#334155; font-size:14px; line-height:1.6;">
                    ${savedOrder.customerInfo.shippingAddress.street},<br/>
                    ${savedOrder.customerInfo.shippingAddress.ward},
                    ${savedOrder.customerInfo.shippingAddress.district},<br/>
                    ${savedOrder.customerInfo.shippingAddress.city}
                  </p>

                  <!-- Items -->
                  <h3 style="color:#0f172a;">Sản phẩm</h3>
                  <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
                    <thead>
                      <tr style="background:#f1f5f9;">
                        <th align="left">Sản phẩm</th>
                        <th align="center">SL</th>
                        <th align="right">Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${savedOrder.items.map(item => `
                        <tr>
                          <td>
                            ${item.name}<br/>
                            <span style="color:#64748b; font-size:12px;">SKU: ${item.sku}</span>
                          </td>
                          <td align="center">${item.quantity}</td>
                          <td align="right">${item.price.toLocaleString('vi-VN')}₫</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>

                  <!-- Summary -->
                  <table width="100%" cellpadding="6" cellspacing="0" style="margin-top:20px; font-size:14px;">
                    <tr>
                      <td>Tạm tính</td>
                      <td align="right">${savedOrder.subtotal.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td>Phí vận chuyển</td>
                      <td align="right">${savedOrder.shippingFee.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td>Giảm giá</td>
                      <td align="right">- ${savedOrder.discountAmount.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td><strong>Tổng thanh toán</strong></td>
                      <td align="right">
                        <strong style="color:#2563eb;">
                          ${savedOrder.totalAmount.toLocaleString('vi-VN')}₫
                        </strong>
                      </td>
                    </tr>
                  </table>

                  ${savedOrder.notes ? `
                  <h3 style="color:#0f172a;">Ghi chú</h3>
                  <p style="color:#334155; font-size:14px;">
                    ${savedOrder.notes}
                  </p>
                  ` : ''}

                  <p style="margin-top:30px; color:#64748b; font-size:14px;">
                    Chúng tôi sẽ sớm xác nhận và xử lý đơn hàng của bạn.
                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận hỗ trợ của Liquid Shop.
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
      to: user.email,
      subject: 'Create Order',
      html: message
    })

    res.status(201).json({
      message: "Create order and email sent successful",
      order: savedOrder,
      paymentUrl: paymentUrl
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Create order error",
      error: error
    });
  }
};

const getOrderByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const order = await Order.findOne({ orderCode: code });

    if (!order) {
      return res.status(400).json({
        message: 'Order not found'
      });
    }

    res.status(201).json({
      message: "Get order by code successful",
      order
    });
  }
  catch {
    console.error(error);
    res.status(500).json({
      message: "Get order by code error",
      error: error
    });
  }
}

const getOrdersUser = async (req, res) => {
  const userId = req.user.id
  try {
    const orders = await Order.find({ userId })

    if (!orders) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    res.status(200).json({
      message: "Get orders user successful",
      data: orders
    })
  }
  catch (error) {
    res.status(500).json({
      message: "Get order user error",
      error
    })
  }
}

const cancelOrder = async (req, res) => {
  const userId = req.user.id
  const { orderCode } = req.params

  try {
    const order = await Order.findOne({ userId, orderCode })

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    order.paymentStatus = "failed"
    order.orderStatus = "cancelled"

    const savedOrder = await order.save()

    res.status(200).json({
      message: "Cancel order successful",
      order: savedOrder
    })

  }
  catch (error) {
    res.status(500).json({
      message: "Cancel order error",
      error
    })
  }
}

module.exports = { createOrder, getOrderByCode, getOrdersUser, cancelOrder }