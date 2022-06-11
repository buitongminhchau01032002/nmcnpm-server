const moment = require('moment');
const Deposit = require('../models/Deposit');
const Saving = require('../models/Saving');
const Rule = require('../models/Rule');

// [POST] api/deposit
const create = async (req, res) => {
    const deposit = req.body;

    // simple Validate
    if (deposit.savingId === undefined || deposit.dateDeposit === undefined || deposit.money === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    // Validate Saving
    let saving;
    try {
        saving = await Saving.findOne({ id: deposit.savingId }).populate('customer').populate('typeSaving');
        if (!saving) {
            return res.status(401).json({
                success: false,
                message: 'Invalid saving',
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }

    // Validate Money
    try {
        const minMoneyDeposit = await Rule.findOne({ name: 'minMoneyDeposit' });
        if (minMoneyDeposit.value > Number(deposit.money)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid money',
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
    let dateDeposit = moment(deposit.dateDeposit);
    let numOfDay = dateDeposit.diff(dateLastExchange, 'day');
    if (numOfDay < 30) {
        return res.status(401).json({
            success: false,
            message: 'Invalid day',
        });
    }

    try {
        const newDeposit = new Deposit(deposit);
        await newDeposit.save();

        let updateSaving = {};
        // Cập nhật ngày
        updateSaving.dateLastExchange = dateDeposit;

        // Tính tiền lãi
        let profit = numOfDay * (saving.currentMoney * (saving.typeSaving.interestRate / 365 / 100));

        if (saving.currentProfit) {
            updateSaving.currentProfit = profit + saving.currentProfit;
        } else {
            updateSaving.currentProfit = profit;
        }
        updateSaving.currentMoney = saving.currentMoney + deposit.money;

        // Update saving (customerId)
        await Saving.findOneAndUpdate({ id: saving.id }, updateSaving, { new: true })
            .populate('customer')
            .populate('typeSaving');

        return res.json({
            success: true,
            message: 'Create deposit successfully',
            deposit: newDeposit,
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
