const moment = require('moment');
const Saving = require('../models/Saving');
const Customer = require('../models/Customer');

// [POST] api/saving
const create = async (req, res) => {
    const saving = req.body;

    // simple Validate
    if (
        saving.typeSavingId === undefined ||
        saving.dateCreate === undefined ||
        saving.money === undefined ||
        saving.identityNumber === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    const newSaving = {
        typeSavingId: Number(saving.typeSavingId),
        dateCreate: moment(saving.dateCreate, 'YYYY-MM-DD').toDate(),
        currentMoney: saving.money,
        dateLastExchange: moment(saving.dateCreate, 'YYYY-MM-DD').toDate(),
    };

    try {
        // Validate Identity Number
        const checkIdentityNumber = await Customer.findOne({ identityNumber: saving.identityNumber });
        if (checkIdentityNumber) {
            // Existed customer
            newSaving.customerId = checkIdentityNumber.id;
            console.log('Không tạo khách hàng');
        } else {
            // New customer

            // Create customer
            const newCustomer = new Customer({
                identityNumber: saving.identityNumber,
                name: saving.nameCustomer,
                address: saving.addressCustomer,
            });
            await newCustomer.save();
            if (!newCustomer) {
                return res.status(401).json({
                    success: false,
                    message: 'Cannot create customer',
                });
            }
            newSaving.customerId = newCustomer.id;
            console.log('Tạo khách hàng');
        }

        // Create saving
        const _newSaving = new Saving(newSaving);
        await _newSaving.save();
        return res.json({
            success: true,
            message: 'Create saving successfully',
            saving: _newSaving,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/saving
const read = async (req, res) => {
    try {
        const savings = await Saving.find({}).populate('customer').populate('typeSaving');
        return res.json({
            success: true,
            savings,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/saving
const readOne = async (req, res) => {
    const id = req.params.id;
    try {
        const saving = await Saving.findOne({ id }).populate('customer').populate('typeSaving');
        if (saving) {
            return res.json({ success: true, saving });
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

// [DELETE] api/delete/:id
const deletee = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedSaving = await Saving.findOneAndDelete({ id });
        if (!deletedSaving) {
            return res.status(401).json({ success: false, message: 'id not found' });
        } else {
            return res.json({ success: true, message: 'customer deleted!', deletedSaving });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { create, read, readOne, deletee };
