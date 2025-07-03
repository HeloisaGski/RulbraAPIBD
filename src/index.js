const express = require('express');
const mongoose = require('./database'); // importa a conexão com MongoDB

const app = express();
const port = 3000;

app.use(express.json());

// importa e usa as rotas
app.use('/users', require('./routes/users'));
app.use('/categories', require('./routes/categories'));
app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/order-items', require('./routes/orderitems'));
app.use('/reports', require('./routes/reports'));

app.get('/', (req, res) => {
  res.send('API RULBRA Online 🍽️');
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
