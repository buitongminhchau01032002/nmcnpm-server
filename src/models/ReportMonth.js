const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportMonthSchema = new Schema(
    {
        typeSavingId: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        soMo: { type: Number, required: true },
        soDong: { type: Number, required: true },
        chenhLech: { type: Number, required: true },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { toJSON: { virtuals: true } },
);

ReportMonthSchema.virtual('typeSaving', {
    ref: 'typeSavings',
    localField: 'typeSavingId',
    foreignField: 'id',
    justOne: true,
});

module.exports = mongoose.model('reportmonths', ReportMonthSchema);
