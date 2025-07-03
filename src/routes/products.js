//atualizadO

// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// cria um novo produto (POST /products)
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// lista todos os produtos com categoria populada (GET /products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category_id');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// busca produtos por category_id (GET /products/by-category/:categoryId)
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category_id: req.params.categoryId }).populate('category_id');
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// busca produto por ID (GET /products/:id)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id');
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// atualiza produto por ID (PUT /products/:id)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// deleta produto por ID (DELETE /products/:id)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
