//conectando o mongodb e importando o mongoose

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://heloisaguincheski:NICO@rulbrinha.qigpiym.mongodb.net/?retryWrites=true&w=majority&appName=Rulbrinha')
  .then(() => console.log('MongoDB conectado com sucesso! 🚀'))
  .catch(err => console.error('Erro ao conectar com MongoDB:', err));

module.exports = mongoose;
