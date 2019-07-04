var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware/index");

//creating a new comment form
router.get("/campgrounds/:id/comments/new", middlewareObj.isLoggedIn,  function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {

		} else {
			res.render("comments/new", { campground: foundCampground});
		}
	});
});

//send new comment form data
router.post("/campgrounds/:id/comments", middlewareObj.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {

		} else {
			Comment.create(req.body.comment, function(err, createdComment) {
				if (err) {

				} else {
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					createdComment.save();
					foundCampground.comments.push(createdComment);
					foundCampground.save();
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});

//editing a comment form
router.get("/campgrounds/:id/comments/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {

		} else {
			res.render("comments/edit", { campground_id: req.params.id, comment: foundComment});
		}
	});
});

//send updated comment data
router.put("/campgrounds/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/campgrounds/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {

		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;