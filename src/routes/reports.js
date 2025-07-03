const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Report = require('../models/Report');

// POST /reports - gera e salva relatório no banco
router.post('/', async (req, res) => {
  const { type } = req.body;

  console.log('Gerando relatório do tipo:', type);

  try {
    let data;

    switch (type) {
      case 'monthly-sales':
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
        break;

      case 'orders-by-customer':
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
        break;

      case 'most-sold-products':
        data = await Order.aggregate([
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.name',
              total_sold: { $sum: '$items.quantity' }
            }
          },
          { $sort: { total_sold: -1 } }
        ]);
        break;

      case 'average-ticket':
        data = await Order.aggregate([
          {
            $group: {
              _id: '$user_id',
              total_spent: { $sum: '$total_amount' },
              total_orders: { $sum: 1 }
            }
          },
          {
            $project: {
              average_ticket: { $divide: ['$total_spent', '$total_orders'] }
            }
          },
          { $sort: { average_ticket: -1 } }
        ]);
        break;

      case 'daily-sales':
        data = await Order.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
              total_sales: { $sum: '$total_amount' },
              total_orders: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        break;

      case 'sales-by-payment-method':
        data = await Order.aggregate([
          {
            $group: {
              _id: '$payment_method',
              total_sales: { $sum: '$total_amount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { total_sales: -1 } }
        ]);
        break;

      case 'least-sold-products':
        data = await Order.aggregate([
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.name',
              total_sold: { $sum: '$items.quantity' }
            }
          },
          { $sort: { total_sold: 1 } }
        ]);
        break;

      case 'orders-by-status':
        data = await Order.aggregate([
          {
            $group: {
              _id: '$status',
              total_orders: { $sum: 1 }
            }
          },
          { $sort: { total_orders: -1 } }
        ]);
        break;

      default:
        return res.status(400).json({ error: 'Tipo de relatório inválido' });
    }

    console.log('Dados do relatório:', data);

    const report = await Report.create({ type, data });
    res.status(201).json(report);
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    res.status(500).json({ error: err.message });
  }
});


// ============ GETs INDIVIDUAIS (sem salvar no banco) ============

// 1. Vendas mensais
router.get('/monthly-sales', async (req, res) => {
  try {
    const data = await Order.aggregate([
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
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Pedidos por cliente
router.get('/orders-by-customer', async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: '$user_id',
          total_orders: { $sum: 1 },
          total_spent: { $sum: '$total_amount' }
        }
      },
      { $sort: { total_spent: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Produtos mais vendidos
router.get('/most-sold-products', async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          total_sold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { total_sold: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Ticket médio por cliente
router.get('/average-ticket', async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: '$user_id',
          total_spent: { $sum: '$total_amount' },
          total_orders: { $sum: 1 }
        }
      },
      {
        $project: {
          average_ticket: { $divide: ['$total_spent', '$total_orders'] }
        }
      },
      { $sort: { average_ticket: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Faturamento diário
router.get('/daily-sales', async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          total_sales: { $sum: '$total_amount' },
          total_orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Vendas por forma de pagamento
router.get('/sales-by-payment-method', async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: '$payment_method',
          total_sales: { $sum: '$total_amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total_sales: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Produtos menos vendidos
router.get('/least-sold-products', async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          total_sold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { total_sold: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Pedidos por status
router.get('/orders-by-status', async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          total_orders: { $sum: 1 }
        }
      },
      { $sort: { total_orders: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
