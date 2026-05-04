const { Order, OrderDetail, Product, User, CartItem } = require('../models');
const { Op } = require('sequelize');

const generateOrderCode = () => `ORD-${Date.now()}`;

// GET /orders - ADMIN/MANAGER sees all, CUSTOMER sees own
const getAll = async (req, res) => {
  try {
    const where = req.user.role === 'CUSTOMER' ? { customer_id: req.user.id } : {};
    const orders = await Order.findAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'avatar'] },
        {
          model: OrderDetail, as: 'details',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'product_code'] }],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// GET /orders/:id
const getById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'avatar'] },
        {
          model: OrderDetail, as: 'details',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    // Customer chỉ xem đơn của mình
    if (req.user.role === 'CUSTOMER' && order.customer_id !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// POST /orders - Customer đặt hàng từ cart
const create = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy cart của user
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: 'product' }],
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    // Kiểm tra stock
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${item.product.name}" không đủ hàng (còn ${item.product.stock})`,
        });
      }
    }

    // Tính tổng tiền
    let total_price = 0;
    const details = cartItems.map((item) => {
      const price = parseFloat(item.product.price);
      total_price += price * item.quantity;
      return { product_id: item.product_id, quantity: item.quantity, price };
    });

    // Tạo order
    const order = await Order.create({
      order_code: generateOrderCode(),
      customer_id: userId,
      total_price,
      status: 'pending',
    });

    // Tạo order details + trừ stock
    for (const d of details) {
      await OrderDetail.create({ ...d, order_id: order.id });
      await Product.decrement('stock', { by: d.quantity, where: { id: d.product_id } });
    }

    // Xóa cart
    await CartItem.destroy({ where: { user_id: userId } });

    res.status(201).json({ message: 'Đặt hàng thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// PUT /orders/:id/status - ADMIN/MANAGER
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    await order.update({ status });
    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

module.exports = { getAll, getById, create, updateStatus };
