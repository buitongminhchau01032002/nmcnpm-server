const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const SavingSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        typeSavingId: {
            type: Number,
            required: true,
        },
        customerId: {
            type: Number,
            required: true,
        },
        dateCreate: {
            type: Date,
            required: true,
        },
        dateLastExchange: {
            type: Date,
            required: true,
        },
        currentMoney: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { toJSON: { virtuals: true } },
);

SavingSchema.virtual('customer', {
    ref: 'customers',
    localField: 'customerId',
    foreignField: 'id',
    justOne: true,
});

SavingSchema.virtual('typeSaving', {
    ref: 'typeSavings',
    localField: 'typeSavingId',
    foreignField: 'id',
    justOne: true,
});

SavingSchema.plugin(AutoIncrement, { id: 'savings', inc_field: 'id' });

module.exports = mongoose.model('savings', SavingSchema);
