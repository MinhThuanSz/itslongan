const { Quotation, QuotationItem, Company, Customer, Product, User } = require('../models');
const sequelize = require('../config/database');

// GET /quotations
const getAll = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      include: [
        { model: Company, as: 'company', attributes: ['id', 'name'] },
        { 
          model: Customer, as: 'customer', 
          include: [{ model: User, as: 'user', attributes: ['name'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// GET /quotations/:id
const getById = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [
        { model: Company, as: 'company' },
        { 
          model: Customer, as: 'customer',
          include: [{ model: User, as: 'user' }]
        },
        { model: QuotationItem, as: 'items' }
      ]
    });
    if (!quotation) return res.status(404).json({ message: 'Không tìm thấy báo giá' });
    res.json(quotation);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// POST /quotations
const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { quote_code, company_id, customer_id, total_amount, note, items } = req.body;

    const quotation = await Quotation.create({
      quote_code,
      company_id,
      customer_id,
      total_amount,
      note
    }, { transaction: t });

    if (items && items.length > 0) {
      const quotationItems = items.map(item => ({
        ...item,
        quotation_id: quotation.id
      }));
      await QuotationItem.bulkCreate(quotationItems, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Tạo báo giá thành công', quotation });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// PUT /quotations/:id
const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { company_id, customer_id, total_amount, note, items } = req.body;
    const quotation = await Quotation.findByPk(req.params.id);
    
    if (!quotation) return res.status(404).json({ message: 'Không tìm thấy báo giá' });

    await quotation.update({
      company_id,
      customer_id,
      total_amount,
      note
    }, { transaction: t });

    // Re-create items (simplest way: delete old ones, create new ones)
    await QuotationItem.destroy({ where: { quotation_id: quotation.id }, transaction: t });
    
    if (items && items.length > 0) {
      const quotationItems = items.map(item => ({
        ...item,
        quotation_id: quotation.id
      }));
      await QuotationItem.bulkCreate(quotationItems, { transaction: t });
    }

    await t.commit();
    res.json({ message: 'Cập nhật báo giá thành công', quotation });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

module.exports = { getAll, getById, create, update };
