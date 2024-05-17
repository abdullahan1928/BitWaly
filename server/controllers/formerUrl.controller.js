// controller for managing edited urls whose destination was also edited

const FormerUrl = require('../models/FormerUrl');

// Function to retrieve a URL by its ID
const getFormerUrlById = async (req, res) => {

    try {
        if (!req.user) {
            return res.status(401).send("Unauthorized");
        }

        const userId = req.user;
        const { id } = req.params;
        
        const url = await FormerUrl.findOne({
            user: userId,
            _id: id
        });

        if (url) {
            return res.status(200).send(url);
        } else {
            return res.status(404).send("URL not found");
        }
    } catch (error) {
        return res.status(500).send("Error processing your request");
    }
};

exports.getFormerUrlById = getFormerUrlById;