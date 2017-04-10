var express               = require("express"),
    app                   = express();

app.set("view engine", "ejs");


// ======================================================
// Add Routes
// ======================================================
app.get("/", function(req, res){
    res.render("landing");
});


// ======================================================
// Wakey wakey!
// ======================================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has awoken!");
});
