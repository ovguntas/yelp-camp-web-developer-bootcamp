const mongoose = require("mongoose");
const { Schema } = mongoose;

const CampgroudSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    price: Number

});

module.exports = mongoose.model("Campground", CampgroudSchema);
