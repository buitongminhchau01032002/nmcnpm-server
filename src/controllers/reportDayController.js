const moment = require('moment');
const ReportDay = require('../models/ReportDay');
const Saving = require('../models/Saving');
const TypeSaving = require('../models/TypeSaving');
const Withdraw = require('../models/Withdraw');
const Deposit = require('../models/Deposit');

// [POST] api/reportDay
const create = async (req, res) => {
    const reportDay = req.body;

    // simple Validate
    if (reportDay.date === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    // kiem tra ton tai
    try {
        const checkReport = await ReportDay.findOne({ date: reportDay.date });
        if (checkReport) {
            return res.status(401).json({ success: false, message: 'Báo cáo đã tồn tại' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

    let typeSavings = [];
    // get typeSavings and saving
    try {
        typeSavings = await TypeSaving.find();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

    // Tao cac bao cao
    for (let i = 0; i < typeSavings.length; i++) {
        let typeSaving = typeSavings[i];
        let withdraws = [];
        let deposits = [];

        try {
            // Lay phieu nhap cua loai tiet kiem
            let _deposits = await Deposit.find({ dateDeposit: reportDay.date }).populate('saving');
            _deposits = _deposits.map((deposit) => deposit.toObject({ virtuals: true }));
            _deposits.forEach((deposit) => {
                if (deposit.saving.typeSavingId === typeSaving.id) {
                    deposits.push(deposit);
                }
            });

            // Lay phieu xuat cua loai tiet kiem
            let _withdraw = await Withdraw.find({ dateWithdraw: reportDay.date }).populate('saving');
            _withdraw = _withdraw.map((withdraw) => withdraw.toObject({ virtuals: true }));
            _withdraw.forEach((withdraw) => {
                if (withdraw.saving.typeSavingId === typeSaving.id) {
                    withdraws.push(withdraw);
                }
            });

            // Tinh tong chi
            let chi = withdraws.reduce((prev, withdraw) => {
                return prev + withdraw.money;
            }, 0);

            // Tinh tong thu
            let thu = deposits.reduce((prev, deposit) => {
                return prev + deposit.money;
            }, 0);

            let chenhLech = thu - chi;
            console.log('báo cáo: ', typeSaving.name, thu, chi, chenhLech);

            // Tao bao cao
            const _newNeport = new ReportDay({
                typeSavingId: typeSaving.id,
                date: reportDay.date,
                tongThu: thu,
                tongChi: chi,
                chenhLech,
            });
            await _newNeport.save();
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }

    try {
        const reports = await ReportDay.find({ date: reportDay.date }).populate('typeSaving');
        return res.json({
            success: true,
            reports,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/reportDay/:date
const read = async (req, res) => {
    const date = req.params.date;

    try {
        const reports = await ReportDay.find({ date }).populate('typeSaving');
        return res.json({ success: true, reports });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { create, read };
