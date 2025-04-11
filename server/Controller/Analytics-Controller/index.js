const Order = require("../../Models/Order");
const User = require("../../Models/User");
const products = require("../../Models/Products");

const getAnalytics = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Orders and Pending Orders
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending Payment" });

    // Total Revenue (sum of totalPrice for all confirmed orders)
    const revenueData = await Order.aggregate([
      { $match: { status: { $in: ["Payment Confirmed", "Shipped", "Delivered"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Top Products (by total quantity sold)
    const topProductsData = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { status: { $in: ["Payment Confirmed", "Shipped", "Delivered"] } } },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.priceAtPurchase"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    const analytics = {
      totalUsers,
      totalOrders,
      pendingOrders,
      totalRevenue,
      topProducts: topProductsData,
    };

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getAnalytics }; 