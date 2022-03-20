// bu uygulamayı sadece database i doldurmak için çalıştırcaz
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const Campground = require("../models/campgroud")
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, mollitia omnis debitis minus rerum modi quo aliquam consequuntur reprehenderit cupiditate atque facilis veniam incidunt ipsam. Ipsa itaque tempore non. Tenetur.",
            price
        });
        await camp.save()
    }
};
seedDB();
