const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// criar nova categoria (POST /categories)
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// listar todas as categorias (GET /categories)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// buscar categoria por ID (GET /categories/:id)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// atualizar categoria por ID (PUT /categories/:id)
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// deletar categoria por ID (DELETE /categories/:id)
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
