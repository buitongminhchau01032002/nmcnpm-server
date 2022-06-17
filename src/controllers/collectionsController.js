const Customer = require('../models/Customer');
const Deposit = require('../models/Deposit');
const ReportDay = require('../models/ReportDay');
const ReportMonth = require('../models/ReportMonth');
const Rule = require('../models/Rule');
const Saving = require('../models/Saving');
const TypeSaving = require('../models/TypeSaving');
const Withdraw = require('../models/Withdraw');

// customer
const customer = async (req, res) => {
    try {
        const customers = await Customer.find({});
        return res.json(customers);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// deposit
const deposit = async (req, res) => {
    try {
        const deposits = await Deposit.find({});
        return res.json(deposits);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// reportDay
const reportDay = async (req, res) => {
    try {
        const reportDays = await ReportDay.find({});
        return res.json(reportDays);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// reportMonth
const reportMonth = async (req, res) => {
    try {
        const reportMonths = await ReportMonth.find({});
        return res.json(reportMonths);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// rule
const rule = async (req, res) => {
    try {
        const rules = await Rule.find({});
        return res.json(rules);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// saving
const saving = async (req, res) => {
    try {
        const savings = await Saving.find({});
        return res.json(savings);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
// typeSaving
const typeSaving = async (req, res) => {
    try {
        const typeSavings = await TypeSaving.find({});
        return res.json(typeSavings);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
// withdraw
const withdraw = async (req, res) => {
    try {
        const withdraws = await withdraw.find({});
        return res.json(withdraws);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { customer, deposit, reportDay, reportMonth, rule, saving, typeSaving, withdraw };
