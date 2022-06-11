const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const WithdrawSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        savingId: {
            type: Number,
            required: true,
        },
        dateWithdraw: {
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

WithdrawSchema.virtual('saving', {
    ref: 'savings',
    localField: 'savingId',
    foreignField: 'id',
    justOne: true,
});

WithdrawSchema.plugin(AutoIncrement, { id: 'withdraws', inc_field: 'id' });

module.exports = mongoose.model('withdraws', WithdrawSchema);
