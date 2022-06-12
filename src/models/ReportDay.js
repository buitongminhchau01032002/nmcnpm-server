const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportDaySchema = new Schema(
    {
        typeSavingId: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        tongThu: { type: Number, required: true },
        tongChi: { type: Number, required: true },
        chenhLech: { type: Number, required: true },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { toJSON: { virtuals: true } },
);

ReportDaySchema.virtual('typeSaving', {
    ref: 'typeSavings',
    localField: 'typeSavingId',
    foreignField: 'id',
    justOne: true,
});

module.exports = mongoose.model('reportdays', ReportDaySchema);
