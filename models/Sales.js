const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    totalSales: {
        type: Schema.Types.Decimal128,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Sales = mongoose.model('sales', SalesSchema);