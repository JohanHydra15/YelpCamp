//include npm packages
var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	flash = require("connect-flash")

//include models
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user")

//initialize express server
var app = express();

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index");

//connect to database
mongoose.connect("mongodb://localhost/my_yelp_camp", { useNewUrlParser: true });

app.set("view engine", "ejs"); //set default file type to .ejs
app.use(express.static(__dirname + "/public")); //serve the public directory as well as the views directory
app.use(bodyParser.urlencoded({ extended: true})); // be able to use the req parameter from post requests
app.use(methodOverride("_method")); //use method override for put and delete requests
app.use(flash()); //use flash messages

//passport configuration
app.use(require("express-session")({
	secret: "JPS KIDS",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//using the routes required
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);




// campgrounds = [
// 	{
// 		name: "Land Before Time",
// 		image: "http://hdqwalls.com/wallpapers/small-memory-lp.jpg"
// 	},
// 	{
// 		name: "Ocean view",
// 		image: "https://images6.alphacoders.com/568/568874.jpg"
// 	},
// 	{
// 		name: "Dark Side",
// 		image: "https://3.bp.blogspot.com/-CJvKAsK6i7w/XFzLeiGy-oI/AAAAAAAAGXA/Hb02ZroJgpUycR7i3Ib3fEU1gBBX48XEACHMYCw/s1600/full-moon-%25E2%259D%25A4-4k-hd-desktop-wallpaper-for-4k-ultra-hd-tv-%25E2%2580%25A2-tablet.jpg"
// 	},
// 	{
// 		name: "Land Before Time",
// 		image: "http://hdqwalls.com/wallpapers/small-memory-lp.jpg"
// 	},
// 	{
// 		name: "Ocean view",
// 		image: "https://images6.alphacoders.com/568/568874.jpg"
// 	},
// 	{
// 		name: "Dark Side",
// 		image: "https://3.bp.blogspot.com/-CJvKAsK6i7w/XFzLeiGy-oI/AAAAAAAAGXA/Hb02ZroJgpUycR7i3Ib3fEU1gBBX48XEACHMYCw/s1600/full-moon-%25E2%259D%25A4-4k-hd-desktop-wallpaper-for-4k-ultra-hd-tv-%25E2%2580%25A2-tablet.jpg"
// 	},
// 	{
// 		name: "Land Before Time",
// 		image: "http://hdqwalls.com/wallpapers/small-memory-lp.jpg"
// 	},
// 	{
// 		name: "Ocean view",
// 		image: "https://images6.alphacoders.com/568/568874.jpg"
// 	},
// 	{
// 		name: "Dark Side",
// 		image: "https://3.bp.blogspot.com/-CJvKAsK6i7w/XFzLeiGy-oI/AAAAAAAAGXA/Hb02ZroJgpUycR7i3Ib3fEU1gBBX48XEACHMYCw/s1600/full-moon-%25E2%259D%25A4-4k-hd-desktop-wallpaper-for-4k-ultra-hd-tv-%25E2%2580%25A2-tablet.jpg"
// 	}
// ];

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("YelpCamp server has started!");
});