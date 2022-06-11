const moment = require('moment');
const Withdraw = require('../models/Withdraw');
const Saving = require('../models/Saving');
const Rule = require('../models/Rule');

// [POST] api/withdraw
const create = async (req, res) => {
    const withdraw = req.body;
    // simple Validate
    if (withdraw.savingId === undefined || withdraw.dateWithdraw === undefined || withdraw.money === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    withdraw.money = Number(withdraw.money);

    // Validate Saving
    let saving;
    try {
        saving = await Saving.findOne({ id: withdraw.savingId }).populate('customer').populate('typeSaving');
        if (!saving) {
            return res.status(401).json({
                success: false,
                message: 'Invalid saving',
            });
        }
        if (saving.dateClose) {
            return res.status(401).json({
                success: false,
                message: 'Sổ đã đóng',
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

    // Tính số ngày lãi
    let dateLastExchange = moment(saving.dateLastExchange);
    let dateWithdraw = moment(withdraw.dateWithdraw);
    let numOfDay = dateWithdraw.diff(dateLastExchange, 'day');

    // Tính tiền lãi
    let profit = numOfDay * (saving.currentMoney * (saving.typeSaving.interestRate / 365 / 100));

    // Tính tổng lãi
    let totalProfit;
    if (saving.currentProfit) {
        totalProfit = profit + saving.currentProfit;
    } else {
        totalProfit = profit;
    }

    // Tính tổng tiền
    let totalMoney = Math.floor(saving.currentMoney + totalProfit);

    console.log(totalMoney);
    // Validate Money
    if (Number(withdraw.money) < 0) {
        return res.status(401).json({
            success: false,
            message: 'Tiền rút phải lớn hơn 0',
        });
    }
    if (totalMoney < Number(withdraw.money)) {
        return res.status(401).json({
            success: false,
            message: 'Tiền rút phải nhỏ hơn tổng',
        });
    }

    console.log(totalMoney, withdraw.money);
    if (saving.typeSaving.termMonth !== 0 && totalMoney !== withdraw.money) {
        return res.status(401).json({
            success: false,
            message: 'Sổ có thời hạn phải rút toàn bộ',
        });
    }

    // Valid day
    // Tính số ngày từ lúc mở sổ
    // Tính số ngày lãi
    let dateCreate = moment(saving.dateCreate);
    let numOfDayCreate = dateWithdraw.diff(dateCreate, 'day');

    if (saving.typeSaving.termMonth !== 0) {
        if (numOfDayCreate < saving.typeSaving.numDayCanWithdraw) {
            return res.status(401).json({
                success: false,
                message: 'Invalid day',
            });
        }
    }

    try {
        const newWithdraw = new Withdraw(withdraw);
        await newWithdraw.save();

        let updateSaving = {};
        // Cập nhật ngày
        updateSaving.dateLastExchange = dateWithdraw;

        // Cập nhật tiền
        updateSaving.currentMoney = totalMoney - withdraw.money;

        // Đóng sổ
        if (updateSaving.currentMoney === 0) {
            updateSaving.dateClose = dateWithdraw;
        }
        // Update saving
        await Saving.findOneAndUpdate({ id: saving.id }, updateSaving, { new: true })
            .populate('customer')
            .populate('typeSaving');

        return res.json({
            success: true,
            message: 'Create withdraw successfully',
            withdraw: newWithdraw,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { create };
