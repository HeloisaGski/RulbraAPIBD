const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  type: String,
  generated_at: { type: Date, default: Date.now },
  data: mongoose.Schema.Types.Mixed // to permitindo qualquer estrutura dentro
});

module.exports = mongoose.model('Report', ReportSchema);
