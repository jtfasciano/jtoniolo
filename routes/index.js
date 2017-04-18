var express             = require("express"),
    router              = express.Router(),
    passport            = require("passport"),
    User                = require("../models/user");


// ======================================================
// Route: Root
// ======================================================
router.get("/", function(req, res){
    res.render("landing");
});


// ======================================================
// Route: New - Show form to create new user
// ======================================================
router.get("/register", function(req, res) {
    res.render("register");
});


// ======================================================
// Route: Create - Add new user to DB
// ======================================================
router.post("/register", function(req, res) {
    switch(Math.floor(Math.random() * 5) + 1  ) {
        case 1:
            userAvatar = "/assets/avatar/monster1_64.png"
            break;
        case 2:
            userAvatar = "/assets/avatar/monster2_64.png"
            break;
        case 3:
            userAvatar = "/assets/avatar/monster3_64.png"
            break;
        case 4:
            userAvatar = "/assets/avatar/monster4_64.png"
            break;
        case 5:
            userAvatar = "/assets/avatar/monster5_64.png"
            break;
    };
    var newUser = new User({username: req.body.username, avatar: userAvatar});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelp, " + user.username + "!");
            res.redirect("/galleries");
        });
    });
});


// ======================================================
// Route: Show form to login
// ======================================================
router.get("/login", function(req, res) {
    res.render("login");
});


// ======================================================
// Route: Login Logic
// ======================================================
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/galleries",
        failureRedirect: "/login"
    })
);


// ======================================================
// Route: Logout Logic
// ======================================================
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged-out. Come back soon!");
    res.redirect("/galleries");
});

module.exports = router;
