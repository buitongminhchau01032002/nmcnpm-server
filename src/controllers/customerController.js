const Customer = require('../models/Customer');

// [POST] api/customer
const create = async (req, res) => {
    const customer = req.body;

    // simple Validate
    if (customer.identityNumber === undefined || customer.name === undefined || customer.address === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    // Validate Identity Number
    const checkIdentityNumber = await Customer.findOne({ identityNumber: customer.identityNumber });
    if (checkIdentityNumber) {
        return res.status(401).json({ success: false, message: 'existed Identity Number' });
    }

    try {
        const newCustomer = new Customer(customer);
        await newCustomer.save();
        return res.json({
            success: true,
            message: 'Create customer successfully',
            customer: newCustomer,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/customer
const read = async (req, res) => {
    try {
        const customers = await Customer.find({});
        return res.json({
            success: true,
            customers,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/customer/:id
const readOne = async (req, res) => {
    const id = req.params.id;
    try {
        const customer = await Customer.findOne({ id });
        if (customer) {
            return res.json({ success: true, customer });
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

// [PUT] api/customer/:id
const update = async (req, res) => {
    const id = Number(req.params.id);
    const customer = req.body;

    // Simple validate
    if (customer.identityNumber === undefined || customer.name === undefined || customer.address === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    // Validate Identity Number
    const checkIdentityNumber = await Customer.findOne({ identityNumber: customer.identityNumber });
    if (checkIdentityNumber && checkIdentityNumber.id !== id) {
        return res.status(401).json({ success: false, message: 'existed Identity Number' });
    }

    try {
        const newCustomer = await Customer.findOneAndUpdate({ id }, customer, { new: true });
        if (!newCustomer) {
            return res.status(401).json({ success: false, message: 'id not found' });
        } else {
            return res.json({ success: true, message: 'customer updated!', newCustomer });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [DELETE] api/customer/:id
const deletee = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedCustomer = await Customer.findOneAndDelete({ id });
        if (!deletedCustomer) {
            return res.status(401).json({ success: false, message: 'id not found' });
        } else {
            return res.json({ success: true, message: 'customer deleted!', deletedCustomer });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/customer/find/identity/:identity
const findIdentityNumber = async (req, res) => {
    const identityNumber = req.params.identity;
    try {
        const customer = await Customer.findOne({ identityNumber });
        if (customer) {
            return res.json({ success: true, customer });
        } else {
            return res.status(401).json({ success: false, message: 'identity number not found' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [GET] api/customer/filter?id=<id>&name=<name>&address=<address>&identityNumber=<identityNumber>
const filter = async (req, res) => {
    const param = req.query;

    const filterObject = {};
    if (param.id) {
        filterObject.id = param.id;
    }
    if (param.identityNumber) {
        filterObject.identityNumber = param.identityNumber;
    }
    if (param.address) {
        filterObject.address = param.address;
    }
    if (param.name) {
        filterObject.name = param.name;
    }
    try {
        let customers = await Customer.find(filterObject);
        return res.json({
            success: true,
            customers,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { create, read, readOne, update, deletee, findIdentityNumber, filter };
