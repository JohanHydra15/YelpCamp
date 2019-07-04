var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware/index");


// index page
router.get("/campgrounds", function(req, res) {
	Campground.find ({}, function(err, campgrounds) {
		if (err) {

		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	})
});

// creating a new campground form
router.get("/campgrounds/new", middlewareObj.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// send new campground form data
router.post("/campgrounds", middlewareObj.isLoggedIn, function(req, res) {
	var newCampground = req.body.campground;
	newCampground.author = {
		id: req.user._id,
		username: req.user.username
	}
	Campground.create(newCampground, function(err, createdCampground) {
		if (err) {

		} else {
			res.redirect("/campgrounds");
		}
	});
});

// view a particular campground
router.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if (err) {

		} else {
			res.render("campgrounds/show", { campground: foundCampground, average: 0});
		}
	});
});

// form route to edit campgrounds
router.get("/campgrounds/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {

		} else {
			res.render("campgrounds/edit", { campground: foundCampground});
		}
	});
});

// send form data to update
router.put("/campgrounds/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect("campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// delete campground route
router.delete("/campgrounds/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;