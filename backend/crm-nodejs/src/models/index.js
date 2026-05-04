const User = require('./User');
const Company = require('./Company');
const Customer = require('./Customer');
const Product = require('./Product');
const Order = require('./Order');
const OrderDetail = require('./OrderDetail');
const CartItem = require('./CartItem');

// Order associations
Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });

Order.hasMany(OrderDetail, { foreignKey: 'order_id', as: 'details' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id' });

OrderDetail.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(OrderDetail, { foreignKey: 'product_id' });

// Cart associations
CartItem.belongsTo(User, { foreignKey: 'user_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cartItems' });

module.exports = { User, Company, Customer, Product, Order, OrderDetail, CartItem };
