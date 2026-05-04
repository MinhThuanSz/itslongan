const { CartItem, Product } = require('../models');

// GET /cart
const getCart = async (req, res) => {
  try {
    const items = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: 'product' }],
    });
    const total = items.reduce((sum, item) => sum + item.quantity * parseFloat(item.product.price), 0);
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// POST /cart - Thêm vào giỏ
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const [item, created] = await CartItem.findOrCreate({
      where: { user_id: req.user.id, product_id },
      defaults: { quantity },
    });

    if (!created) {
      await item.increment('quantity', { by: quantity });
      await item.reload();
    }

    res.json({ message: 'Đã thêm vào giỏ hàng', item });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// PUT /cart/:id - Cập nhật số lượng
const updateCart = async (req, res) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' });

    const { quantity } = req.body;
    if (quantity < 1) {
      await item.destroy();
      return res.json({ message: 'Đã xóa khỏi giỏ hàng' });
    }
    await item.update({ quantity });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// DELETE /cart/:id - Xóa item
const removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' });
    await item.destroy();
    res.json({ message: 'Đã xóa khỏi giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// DELETE /cart - Xóa hết giỏ
const clearCart = async (req, res) => {
  try {
    await CartItem.destroy({ where: { user_id: req.user.id } });
    res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
