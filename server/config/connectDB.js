const mongoose = require("mongoose");
const dotenv = require("dotenv");
const uri = `mongodb+srv://admin:admin@cluster0.xafgy5n.mongodb.net/?retryWrites=true&w=majority`;
const Analytics = require("../models/Analytics.model");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        mongoose
            .connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log(`MongoDB Connected successfully ${MONGO_URI}`);
            });
    } catch (error) {
        console.log(`somer error occur ${error}`);
    }
};

// Delete all Analytics data
// Analytics.deleteMany({}).then(() => {
//     console.log("All Analytics data deleted");
// });

module.exports = connectDB;