const { User, Customer, Company } = require('../models');

// GET /users - ADMIN & MANAGER
const getAll = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// POST /users - ADMIN
const create = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const user = await User.create({ name, email, password, phone, address, role: role || 'CUSTOMER', provider: 'local' });
    const data = user.toJSON(); delete data.password;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// PUT /users/:id - ADMIN
const update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const { name, phone, address, role, password, avatar } = req.body;
    await user.update({ name, phone, address, role, avatar, ...(password ? { password } : {}) });

    const data = user.toJSON(); delete data.password;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// DELETE /users/:id - ADMIN
const remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    await user.destroy();
    res.json({ message: 'Xóa user thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// GET /users/profile - Current user
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: require('../models/Customer'), as: 'customerProfile', include: [{ model: Company, as: 'company' }] }],
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// PUT /users/profile - Current user
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const { name, phone, address, avatar, password } = req.body;
    await user.update({ name, phone, address, avatar, ...(password ? { password } : {}) });

    const data = user.toJSON(); delete data.password;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

module.exports = { getAll, create, update, remove, getProfile, updateProfile };
