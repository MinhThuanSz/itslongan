const { Order } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/database');

// GET /revenue/daily?date=2026-05-04
const daily = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const result = await Order.findAll({
      where: {
        status: 'completed',
        created_at: {
          [Op.gte]: new Date(`${date}T00:00:00`),
          [Op.lte]: new Date(`${date}T23:59:59`),
        },
      },
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'total_orders'],
        [fn('SUM', col('total_price')), 'revenue'],
      ],
      group: [fn('DATE', col('created_at'))],
      raw: true,
    });

    res.json({ date, data: result[0] || { date, total_orders: 0, revenue: 0 } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// GET /revenue/monthly?year=2026&month=5
const monthly = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00`);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await Order.findAll({
      where: {
        status: 'completed',
        created_at: { [Op.between]: [startDate, endDate] },
      },
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'total_orders'],
        [fn('SUM', col('total_price')), 'revenue'],
      ],
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true,
    });

    const totalRevenue = result.reduce((sum, r) => sum + parseFloat(r.revenue || 0), 0);
    const totalOrders = result.reduce((sum, r) => sum + parseInt(r.total_orders || 0), 0);

    res.json({ year, month, total_revenue: totalRevenue, total_orders: totalOrders, daily_breakdown: result });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// GET /revenue/summary - Tổng quan dashboard
const summary = async (req, res) => {
  try {
    const [totalRevenue, totalOrders, pendingOrders, canceledOrders] = await Promise.all([
      Order.sum('total_price', { where: { status: 'completed' } }),
      Order.count({ where: { status: 'completed' } }),
      Order.count({ where: { status: 'pending' } }),
      Order.count({ where: { status: 'canceled' } }),
    ]);

    res.json({
      total_revenue: totalRevenue || 0,
      completed_orders: totalOrders || 0,
      pending_orders: pendingOrders || 0,
      canceled_orders: canceledOrders || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

module.exports = { daily, monthly, summary };
