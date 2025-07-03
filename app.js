const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 
const app = express();

app.use(express.json());

// conectando o mongodb
mongoose.connect('mongodb+srv://heloisaguincheski:NICO@rulbrinha.qigpiym.mongodb.net/?retryWrites=true&w=majority&appName=Rulbrinha', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));

app.use(express.static(path.join(__dirname, 'public'))); 


// rotas
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderitems');
const reportRoutes = require('./routes/reports');

// usando as bencao das rotas
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/orderitems', orderItemRoutes);
app.use('/reports', reportRoutes);

app.listen(3000, () => {
  console.log('App Running on http://localhost:3000');
});
