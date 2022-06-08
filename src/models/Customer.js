const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    id: {
        type: Number,
        unique: true,
    },
    identityNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
CustomerSchema.plugin(AutoIncrement, { id: 'customers', inc_field: 'id' });

module.exports = mongoose.model('customers', CustomerSchema);
