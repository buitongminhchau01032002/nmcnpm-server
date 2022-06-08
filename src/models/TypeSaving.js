const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const TypeSavingSchema = new Schema({
    id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    termMonth: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    numDayCanWithdraw: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

TypeSavingSchema.plugin(AutoIncrement, { id: 'typeSavings', inc_field: 'id' });

module.exports = mongoose.model('typeSavings', TypeSavingSchema);
