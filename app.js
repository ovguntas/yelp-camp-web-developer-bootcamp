const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync")

const mongoose = require("mongoose");
const Campground = require("./models/campgroud")

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const Joi = require("joi")

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))

// using of ejs-mate
app.engine("ejs", ejsMate)

// all basic crud routes (RestAPI)
app.get("/campgrounds", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}))
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) throw new ExpressError("There is no such campground", 404)
    res.render("campgrounds/show", { campground })
}))
app.post("/campgrounds", catchAsync(async (req, res, next) => {
    if (!req.body.location || !req.body.title) throw new ExpressError("Invalid data for campground", 400);
    const campground = new Campground(req.body);
    const addedCampground = await campground.save()
    res.redirect(`/campgrounds/${addedCampground._id}`)
}))
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground })

}))
app.put("/campgrounds/:id", catchAsync(async (req, res) => {
    const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/campgrounds/${updatedCampground.id}`)
}))
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds")
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Oh No, Something went wrong!!"
    res.status(status).render("error", { err })
})


app.listen(3000, () => {
    console.log("Port 3000 is being listened")
})