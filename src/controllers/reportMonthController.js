const moment = require('moment');
const ReportMonth = require('../models/ReportMonth');
const Saving = require('../models/Saving');
const TypeSaving = require('../models/TypeSaving');
const Withdraw = require('../models/Withdraw');
const Deposit = require('../models/Deposit');

// [POST] api/reportMonth
const create = async (req, res) => {
    const reportMonth = req.body.month;
    // simple Validate
    if (reportMonth === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    // kiem tra ton tai
    try {
        const allReports = await ReportMonth.find({});
        for (let i = 0; i < allReports.length; i++) {
            let report = allReports[i];
            if (moment(report.date).format('YYYY-MM') === moment(reportMonth).format('YYYY-MM')) {
                return res.status(401).json({ success: false, message: 'Báo cáo đã tồn tại' });
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

    // Lay tat ca saving
    let allSaving = [];
    try {
        allSaving = await Saving.find({}).populate('typeSaving');
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

    let reports = [];
    for (let i = 0; i < allSaving.length; i++) {
        let saving = allSaving[i];
        let dateCreate = moment(saving.dateCreate).format('YYYY-MM-DD');
        let dateClose = saving.dateClose ? moment(saving.dateClose).format('YYYY-MM-DD') : null;
        console.log('so', dateCreate, dateClose);
        if (moment(dateCreate).format('YYYY-MM') === moment(reportMonth).format('YYYY-MM')) {
            let iReport = reports.findIndex(
                (report) => report.date === dateCreate && report.typeSavingId === saving.typeSaving.id,
            );
            if (iReport !== -1) {
                // Neu da ton tai bao cao
                reports[iReport].soMo++;
                reports[iReport].chenhLech++;
            } else {
                console.log('tao report mo');
                reports.push({
                    typeSavingId: saving.typeSaving.id,
                    date: dateCreate,
                    soMo: 1,
                    soDong: 0,
                    chenhLech: 1,
                });
            }
        }

        if (dateClose !== null && moment(dateClose).format('YYYY-MM') === moment(reportMonth).format('YYYY-MM')) {
            let iReport = reports.findIndex(
                (report) => report.date === dateClose && report.typeSavingId === saving.typeSaving.id,
            );

            if (iReport !== -1) {
                // Neu da ton tai bao cao

                reports[iReport].soDong++;
                reports[iReport].chenhLech--;
            } else {
                console.log('tao report dong');

                reports.push({
                    typeSavingId: saving.typeSaving.id,
                    date: dateClose,
                    soMo: 0,
                    soDong: 1,
                    chenhLech: -1,
                });
            }
        }
    }

    console.log(reports);

    /////// Tao bao cao
    for (let i = 0; i < reports.length; i++) {
        // Tao bao cao
        const _newNeport = new ReportMonth({
            typeSavingId: reports[i].typeSavingId,
            date: reports[i].date,
            soMo: reports[i].soMo,
            soDong: reports[i].soDong,
            chenhLech: reports[i].chenhLech,
        });
        try {
            await _newNeport.save();
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    return res.json({
        success: true,
        message: 'Created month report',
    });
};

// [GET] api/reportMonth/:month?typeSavingId=<id>
const read = async (req, res) => {
    const month = req.params.month;
    const typeSavingId = Number(req.query.typeSavingId);
    try {
        const reports = await ReportMonth.find().populate('typeSaving').sort({ date: 1 });
        const _reports = [];
        for (let i = 0; i < reports.length; i++) {
            if (
                moment(reports[i].date).format('YYYY-MM') === moment(month).format('YYYY-MM') &&
                typeSavingId === reports[i].typeSavingId
            ) {
                _reports.push(reports[i]);
            }
        }
        return res.json({ success: true, reports: _reports });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { create, read };
