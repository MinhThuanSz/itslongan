const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quotation = sequelize.define('Quotation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quote_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  sub_total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  vat: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'approved', 'rejected', 'pending'),
    defaultValue: 'draft',
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'crm_quotations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Quotation;
