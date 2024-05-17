//config file that connects server to mongodb

const mongoose = require("mongoose");
const dotenv = require("dotenv");

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



module.exports = connectDB;