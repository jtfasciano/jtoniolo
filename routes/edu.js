var express             = require("express"),
    router              = express.Router(),
    middleware          = require("../middleware"),
    User                = require("../models/user");


// ======================================================
// Route: Index
// ======================================================
router.get("/", function(req, res){
    res.render("edu/index");
});



module.exports = router;
