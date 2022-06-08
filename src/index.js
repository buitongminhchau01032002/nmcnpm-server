const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// require routes
const customerRoute = require('./routes/customer');
const typeSavingRoute = require('./routes/typeSaving');

// db
const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nmcnpm.nttjj.mongodb.net/nmcnpm?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log('DB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
connectDB();

// app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const PORT = 5000;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// routes
app.use('/api/customer', customerRoute);
app.use('/api/typesaving', typeSavingRoute);

app.listen(PORT, () => {
    console.log('App running at port: ' + PORT);
});
