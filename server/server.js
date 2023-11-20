const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/connectDB');

dotenv.config();

const app = express();

connectDB();

const corsOptions = {
    origin: [
        process.env.CLIENT_PROD_URL,
        process.env.CLIENT_DEV_URL,
    ],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));

// app.use('/admin', require('./routes/admin.route'));

const environment = process.env.NODE_ENV;

if (environment === 'development') {

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

} else {
    console.log('Server is running in production');
}