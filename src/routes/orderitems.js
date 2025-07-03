const express = require('express');
const router = express.Router();
const OrderItem = require('../models/OrderItem');

// criar um novo item do pedido (POST /orderitems)
router.post('/', async (req, res) => {
  try {
    const item = await OrderItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// listar todos os itens com order e product populados (GET /orderitems)
router.get('/', async (req, res) => {
  try {
    const items = await OrderItem.find()
      .populate('order_id')
      .populate('product_id');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// buscar item pelo ID (GET /orderitems/:id)
router.get('/:id', async (req, res) => {
  try {
    const item = await OrderItem.findById(req.params.id)
      .populate('order_id')
      .populate('product_id');
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// att item pelo ID (PUT /orderitems/:id)
router.put('/:id', async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('order_id')
      .populate('product_id');
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// deletar item pelo ID (DELETE /orderitems/:id)
router.delete('/:id', async (req, res) => {
  try {
    const item = await OrderItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.json({ message: 'Item deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
