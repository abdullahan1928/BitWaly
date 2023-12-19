const mongoose = require("mongoose");
const uri = `mongodb+srv://admin:admin@cluster0.xafgy5n.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        mongoose
            .connect(uri)
            .then(() => {
                console.log("MongoDB Connected successfully");
            });
    } catch (error) {
        console.log(`somer error occur ${error}`);
    }
};

module.exports = connectDB;