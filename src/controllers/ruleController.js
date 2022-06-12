const Rule = require('../models/Rule');

// [GET] api/rule
const read = async (req, res) => {
    try {
        const rules = await Rule.find({});
        return res.json({
            success: true,
            rules,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/rule/:name
const readOne = async (req, res) => {
    const name = req.params.name;
    try {
        const rule = await Rule.findOne({ name });
        if (rule) {
            return res.json({ success: true, rule });
        } else {
            return res.status(401).json({ success: false, message: 'name rule not found' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [PUT] api/rule/:name
const update = async (req, res) => {
    const name = req.params.name;
    const rule = req.body;

    if (rule.value === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    try {
        const newRule = await Rule.findOneAndUpdate({ name }, rule, { new: true });
        if (!newRule) {
            return res.status(401).json({ success: false, message: 'name rule not found' });
        } else {
            return res.json({ success: true, message: 'rule updated!', newRule });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [PUT] api/rule
const updateAll = async (req, res) => {
    const rules = req.body;

    if (rules.minMoneyBegin === undefined || rules.minMoneyDeposit === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    try {
        const newminMoneyBegin = await Rule.findOneAndUpdate(
            { name: 'minMoneyBegin' },
            {
                value: rules.minMoneyBegin,
            },
            { new: true },
        );
        const newminMoneyDeposit = await Rule.findOneAndUpdate(
            { name: 'minMoneyDeposit' },
            {
                value: rules.minMoneyDeposit,
            },
            { new: true },
        );
        if (!newminMoneyBegin || !newminMoneyDeposit) {
            return res.status(401).json({ success: false, message: 'name rule not found' });
        } else {
            return res.json({ success: true, message: 'rule updated!' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { read, readOne, update, updateAll };
