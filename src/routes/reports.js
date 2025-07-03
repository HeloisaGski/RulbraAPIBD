const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Report = require('../models/Report');

// GET /reports/monthly-sales (relatório calculado na hora)
router.get('/monthly-sales', async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          total_sales: { $sum: '$total_amount' },
          total_orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /reports/orders-by-customer (relatório calculado na hora)
router.get('/orders-by-customer', async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: '$user_id',
          total_orders: { $sum: 1 },
          total_spent: { $sum: '$total_amount' }
        }
      },
      { $sort: { total_spent: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /reports (gera e salva relatório no banco)
router.post('/', async (req, res) => {
  const { type } = req.body;

  try {
    let data;

    if (type === 'monthly-sales') {
      data = await Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$created_at' },
              month: { $month: '$created_at' }
            },
            total_sales: { $sum: '$total_amount' },
            total_orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
    } else if (type === 'orders-by-customer') {
      data = await Order.aggregate([
        {
          $group: {
            _id: '$user_id',
            total_orders: { $sum: 1 },
            total_spent: { $sum: '$total_amount' }
          }
        },
        { $sort: { total_spent: -1 } }
      ]);
    } else {
      return res.status(400).json({ error: 'Tipo de relatório inválido' });
    }

    const report = await Report.create({ type, data });
    res.status(201).json(report);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /reports/history (listar relatórios salvos)
router.get('/history', async (req, res) => {
  try {
    const reports = await Report.find().sort({ generated_at: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /reports/history/:id (relatório específico salvo)
router.get('/history/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// DELETE /reports/history/:id (remover relatório)
router.delete('/history/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }
    res.json({ message: 'Relatório deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
