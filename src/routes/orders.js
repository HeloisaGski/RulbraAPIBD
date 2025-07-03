const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// cria um novo pedido (POST /orders)
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// lista todos os pedidos (GET /orders) com usuário populado
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user_id');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// busca pedido por ID (GET /orders/:id) com usuário populado
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user_id');
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// at pedido por ID (PUT /orders/:id)
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// deletar pedido por ID (DELETE /orders/:id)
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
