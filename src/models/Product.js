const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: Number,
  created_at: { type: Date, default: Date.now },
  image_url: String
});

module.exports = mongoose.model('Product', ProductSchema);
