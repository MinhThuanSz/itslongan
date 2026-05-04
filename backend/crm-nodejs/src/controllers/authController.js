const { User } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// POST /auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    const user = await User.create({
      name, email, password, phone, address,
      role: role && ['ADMIN', 'MANAGER', 'CUSTOMER'].includes(role) ? role : 'CUSTOMER',
      provider: 'local',
    });

    const token = generateToken(user);
    const userData = user.toJSON();
    delete userData.password;

    res.status(201).json({ message: 'Đăng ký thành công', token, user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (user.provider !== 'local') {
      return res.status(400).json({ message: `Tài khoản này đăng nhập bằng ${user.provider}. Vui lòng dùng phương thức đó.` });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(user);
    const userData = user.toJSON();
    delete userData.password;

    res.json({ message: 'Đăng nhập thành công', token, user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// GET /auth/me
const getMe = async (req, res) => {
  const userData = req.user.toJSON();
  delete userData.password;
  res.json({ user: userData });
};

// POST /auth/logout
const logout = (req, res) => {
  res.json({ message: 'Đăng xuất thành công' });
};

module.exports = { register, login, getMe, logout };
