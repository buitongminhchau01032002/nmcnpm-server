const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const DepositSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        savingId: {
            type: Number,
            required: true,
        },
        dateDeposit: {
            type: Date,
            required: true,
        },
        money: {
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

DepositSchema.virtual('saving', {
    ref: 'savings',
    localField: 'savingId',
    foreignField: 'id',
    justOne: true,
});

DepositSchema.plugin(AutoIncrement, { id: 'deposits', inc_field: 'id' });

module.exports = mongoose.model('deposits', DepositSchema);
