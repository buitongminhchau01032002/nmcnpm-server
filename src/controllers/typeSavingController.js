const TypeSaving = require('../models/TypeSaving');

// [POST] api/typesaving
const create = async (req, res) => {
    const typeSaving = req.body;

    // Simple validate
    if (
        typeSaving.name === undefined ||
        typeSaving.termMonth === undefined ||
        typeSaving.interestRate === undefined ||
        typeSaving.numDayCanWithdraw === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    try {
        const newTypeSaving = new TypeSaving(typeSaving);
        await newTypeSaving.save();
        return res.json({
            success: true,
            message: 'type saving created',
            typeSaving: newTypeSaving,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/typesaving
const read = async (req, res) => {
    try {
        const typeSavings = await TypeSaving.find({});
        return res.json({ success: true, typeSavings });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/typesaving/:id
const readOne = async (req, res) => {
    const id = req.params.id;
    try {
        const typeSaving = await TypeSaving.findOne({ id });
        if (typeSaving) {
            return res.json({ success: true, typeSaving });
        } else {
            return res.status(401).json({ success: false, message: 'id not found' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [PUT] api/typesaving/:id
const update = async (req, res) => {
    const id = req.params.id;
    const typeSaving = req.body;

    // Simple validate
    if (
        typeSaving.name === undefined ||
        typeSaving.termMonth === undefined ||
        typeSaving.interestRate === undefined ||
        typeSaving.numDayCanWithdraw === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    try {
        const newTypeSaving = await TypeSaving.findOneAndUpdate({ id }, typeSaving, { new: true });
        if (!newTypeSaving) {
            return res.status(401).json({ success: false, message: 'id not found' });
        } else {
            return res.json({ success: true, message: 'type saving updated!', newTypeSaving });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [DELETE] api/typesaving/:id
const deletee = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedTypeSaving = await TypeSaving.findOneAndDelete({ id });
        if (!deletedTypeSaving) {
            return res.status(401).json({ success: false, message: 'id not found' });
        } else {
            return res.json({ success: true, message: 'type saving deleted!', deletedTypeSaving });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { create, read, update, deletee, readOne };
