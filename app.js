var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    User                = require("./models/user");


var commentRoutes       = require("./routes/comments"),
    galleriesRoutes     = require("./routes/galleries"),
    eduRoutes           = require("./routes/edu"),
    indexRoutes         = require("./routes/index");

var url                 = process.env.DBURL || "mongodb://localhost/jtoniolo",
    port                = process.env.PORT || 5000,
    ip                  = process.env.IP;

mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());



// ======================================================
// Configure: Passport
// ======================================================
app.use(require("express-session")({
    secret: "I still don't understand ths point of having this here...wtf is it!", //add to ENV Variable?
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error =  req.flash("error");
    res.locals.success =  req.flash("success");
    next();
});


// ======================================================
// Use Routes
// ======================================================
app.use("/", indexRoutes);
app.use("/galleries", galleriesRoutes);
app.use("/galleries/:id/comments", commentRoutes);
app.use("/edu", eduRoutes);


// ======================================================
// Wakey Wakey!!
// ======================================================
app.listen(port, ip, function(){
    console.log("<<<<<<<<<< It's Alive! >>>>>>>>>>");
});
