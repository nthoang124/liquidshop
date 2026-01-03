const Order = require("../../models/orderModel");
const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const mongoose = require("mongoose");

class DashboardController {
  async overview(req, res) {
    try {
      const now = new Date();

      const startOfToday = new Date(now.setHours(0, 0, 0, 0));
      const start7DaysAgo = new Date(startOfToday);
      start7DaysAgo.setDate(start7DaysAgo.getDate() - 6);

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const startOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
      const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

      const startOfYear = new Date(new Date().getFullYear(), 0, 1);

      const newUsers7Days = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: start7DaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const revenue7Days = await Order.aggregate([
        {
          $match: {
            orderStatus: "completed",
            createdAt: { $gte: start7DaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$totalAmount" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const ordersByDayInMonth = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lt: startOfNextMonth
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const topProducts = await Product.find()
        .sort({ soldCount: -1 })
        .limit(10)

      const topNewUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10)

      const [
        totalUsers,
        totalProducts,
        revenueThisYear,
        revenueThisMonth,
        revenueLastMonth,
      ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.aggregate([
          { $match: { orderStatus: "completed", createdAt: { $gte: startOfYear } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]),
        Order.aggregate([
          { $match: { orderStatus: "completed", createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]),
        Order.aggregate([
          {
            $match: {
              orderStatus: "completed",
              createdAt: { $gte: startOfLastMonth, $lt: startOfMonth }
            }
          },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ])
      ]);

      res.json({
        usersNew7Days: formatChart(newUsers7Days),
        revenue7Days: formatChart(revenue7Days, "total"),
        ordersByDayInMonth: formatChart(ordersByDayInMonth),
        topProducts,
        topNewUsers,
        totals: {
          users: totalUsers,
          products: totalProducts,
          revenueThisYear: revenueThisYear[0]?.total || 0,
          revenueThisMonth: revenueThisMonth[0]?.total || 0,
          revenueLastMonth: revenueLastMonth[0]?.total || 0
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Dashboard error" });
    }
  }
}

function formatChart(data, valueKey = "count") {
  return {
    labels: data.map(i => i._id),
    data: data.map(i => i[valueKey])
  };
}

module.exports = new DashboardController();
