const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  company_id: { type: DataTypes.INTEGER, allowNull: true },
  type: {
    type: DataTypes.ENUM('company_customer', 'individual_customer'),
    defaultValue: 'individual_customer',
  },
}, {
  tableName: 'crm_customers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Customer.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });
User.hasOne(Customer, { foreignKey: 'user_id', as: 'customerProfile' });

module.exports = Customer;
