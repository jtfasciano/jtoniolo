var express             = require("express"),
    router              = express.Router(),
    middleware          = require("../middleware"),
    Gallery             = require("../models/gallery");


// ======================================================
// Route: Index
// ======================================================
router.get("/", function(req, res){
    //console.log(req.user);
    Gallery.find({}, function(err, allGalleries){
        if(err){
            console.log(err);
        } else {
            res.render("galleries/index", {galleries:allGalleries, currentUser: req.user});
        }
    });
});


// ======================================================
// Route: Create - Add new gallery to DB
// ======================================================
router.post("/", middleware.isLoggedIn, function(req, res){
    // Get data from form and add to galleries array
    var name = req.body.name;
    var type = req.body.type;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newGallery = {name: name, type: type, image: image, description: description, author:author};
    // Create a new gallery and save to database
    Gallery.create(newGallery, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // Redirect back to galleries page
            //console.log(newlyCreated);
            res.redirect("/galleries");
        }
    });

});


// ======================================================
// Route: New - Show form to create new gallery
// ======================================================
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("galleries/new");
});


// ======================================================
// Route: Show - Shows more info about one gallery
// ======================================================
router.get("/:id", function(req, res){
    // Find the gallery with the provided ID
    Gallery.findById(req.params.id).populate("comments").exec(function(err, foundGallery){
        if(err){
            console.log("Error man...WTF!?!!?");
        } else {
            //console.log(foundGallery);
            // Render show template with that gallery
            res.render("galleries/show", {gallery: foundGallery});
        }
    });
});

// ======================================================
// Route: Edit - Show form to edit existing gallery
// ======================================================
router.get("/:id/edit", middleware.checkGalleryOwnership, function(req, res) {
    Gallery.findById(req.params.id, function(err, foundGallery){
        if(err){
            req.flash("error", "DB Error - Cannot find gallery!");
            res.redirect("back");
        } else {
            res.render("galleries/edit", {gallery: foundGallery});
        }
    });
});


// ======================================================
// Route: Update - Update gallery in DB
// ======================================================
router.put("/:id", middleware.checkGalleryOwnership, function(req,res){
   //Find and update the correct gallery
   Gallery.findByIdAndUpdate(req.params.id, req.body.gallery, function(err, updatedGallery){
      if(err){
          res.redirect("/galleries");
      } else {
          res.redirect("/galleries/" + req.params.id);
      }
   });
   //Redirect to show page for gallery
});


// ======================================================
// Route: Destroy - Remove gallery from DB
// ======================================================
router.delete("/:id", middleware.checkGalleryOwnership, function(req, res){
    Gallery.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/galleries");
        } else {
            res.redirect("/galleries");
        }
    });
});


module.exports = router;
