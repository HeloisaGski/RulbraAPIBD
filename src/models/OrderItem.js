const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  unit_price: Number,
  subtotal: Number
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
