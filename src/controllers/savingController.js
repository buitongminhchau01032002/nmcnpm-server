const moment = require('moment');
const Saving = require('../models/Saving');
const Customer = require('../models/Customer');
const Rule = require('../models/Rule');

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

    try {
        const minMoney = await Rule.findOne({ name: 'minMoneyBegin' });
        if (minMoney.value > Number(saving.money)) {
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
    const { currentDay } = req.query;

    try {
        let savings = await Saving.find({}).populate('customer').populate('typeSaving');

        savings = savings.map((saving) => saving.toObject({ virtuals: true }));
        savings.forEach((saving) => {
            let totalMoney = -1;
            if (currentDay) {
                // Tính số ngày lãi
                let dateLastExchange = moment(saving.dateLastExchange);
                let _currentDay = moment(currentDay);
                let numOfDay = _currentDay.diff(dateLastExchange, 'day');

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
                totalMoney = Math.floor(saving.currentMoney + totalProfit);
                saving.totalMoney = totalMoney;
            }
        });

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

// [GET] api/saving/:id
const readOne = async (req, res) => {
    const id = req.params.id;
    const { currentDay } = req.query;
    try {
        let saving = await Saving.findOne({ id }).populate('customer').populate('typeSaving');
        if (saving) {
            saving = saving.toObject({ virtuals: true });
            let totalMoney = -1;
            if (currentDay) {
                // Tính số ngày lãi
                let dateLastExchange = moment(saving.dateLastExchange);
                let _currentDay = moment(currentDay);
                let numOfDay = _currentDay.diff(dateLastExchange, 'day');
                console.log('Day in saving:', numOfDay);

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
                totalMoney = Math.floor(saving.currentMoney + totalProfit);
                saving.totalMoney = totalMoney;
            }

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

// [PUT] api/saving/:id
const update = async (req, res) => {
    const id = Number(req.params.id);
    const saving = req.body;
    console.log(saving);
    // simple Validate
    if (saving.identityNumber === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing field',
        });
    }

    let customerId;

    try {
        // Validate Identity Number
        const checkIdentityNumber = await Customer.findOne({ identityNumber: saving.identityNumber });
        if (checkIdentityNumber) {
            // Existed customer
            customerId = checkIdentityNumber.id;
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

            customerId = newCustomer.id;
        }

        // Update saving (customerId)
        const newSaving = await Saving.findOneAndUpdate(
            { id },
            { customerId, dateCreate: saving.dateCreate, typeSavingId: saving.typeSavingId },
            { new: true },
        )
            .populate('customer')
            .populate('typeSaving');
        if (!newSaving) {
            return res.status(401).json({ success: false, message: 'id not found' });
        } else {
            return res.json({ success: true, message: 'saving updated!', newSaving });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// [DELETE] api/saving/:id
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

// [GET] api/saving/filter?id=<id>&nameCustomer=<nameCustomer>&typesavingId=<typesavingId>&currentMoney=<currentMoney>
const filter = async (req, res) => {
    const param = req.query;

    const filterObject = {};
    if (param.id) {
        filterObject.id = param.id;
    }
    if (param.typeSavingId) {
        filterObject.typeSavingId = param.typeSavingId;
    }
    if (param.currentMoney) {
        filterObject.currentMoney = param.currentMoney;
    }
    try {
        let savings = await Saving.find(filterObject).populate('customer').populate('typeSaving');
        savings = savings.map((saving) => saving.toObject({ virtuals: true }));
        if (param.nameCustomer) {
            savings = savings.filter((saving) => saving.customer.name === param.nameCustomer);
        }
        savings.forEach((saving) => {
            let totalMoney = -1;
            currentDay = param.currentDay;
            if (currentDay) {
                // Tính số ngày lãi
                let dateLastExchange = moment(saving.dateLastExchange);
                let _currentDay = moment(currentDay);
                let numOfDay = _currentDay.diff(dateLastExchange, 'day');

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
                totalMoney = Math.floor(saving.currentMoney + totalProfit);
                saving.totalMoney = totalMoney;
            }
        });
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

module.exports = { create, read, readOne, update, deletee, filter };
