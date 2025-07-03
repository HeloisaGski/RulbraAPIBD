const express = require('express');
const router = express.Router();
const User = require('../models/User');

// criar um novo usuário (POST /users)
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// listar todos os usuários (GET /users)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// buscar usuário por ID (GET /users/:id)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// atualizar usuário por ID (PUT /users/:id)
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// deletar usuário por ID (DELETE /users/:id)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;
