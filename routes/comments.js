var express             = require("express"),
    router              = express.Router({mergeParams: true}),
    middleware          = require("../middleware"),
    Gallery             = require("../models/gallery"),
    Comment             = require("../models/comment");


// ======================================================
// Route: New - Show form to create new comment
// ** DECOMMISSIONED - MOVED INTO GALLERY SHOW **
// ======================================================
// router.get("/new", middleware.isLoggedIn, function(req, res){
//     // Find Gallery by ID
//     Gallery.findById(req.params.id, function(err, gallery){
//         if(err){
//             console.log(err);
//         } else {
//             res.render("comments/new", {gallery: gallery});
//         }
//     });
// });

// ======================================================
// Route: Create - Add new comment to DB
// ======================================================
router.post("/", middleware.isLoggedIn, middleware.validateComment, function(req, res){
   // Lookup Gallery using ID
   Gallery.findById(req.params.id, function(err, gallery) {
      if(err){
          console.log(err);
          res.redirect("/galleries");
      } else {
          // Create new Comment
          Comment.create(req.body.comment, function(err, comment){
             if(err){
                 req.flash("error", "Oops! DB Error...Try again!");
                 console.log(err);
             } else {
                //Add username and ID to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.author.avatar = req.user.avatar;
                 //Save comment
                 comment.save();
                 gallery.comments.push(comment);
                 gallery.save();
                 //console.log(comment);
                 req.flash("success", "New comment created!");
                 res.redirect("/galleries/" + gallery._id);
             }
          });
      }
   });

});


// ======================================================
// Route: Edit - Show form to edit existing comment
// ======================================================
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {gallery_id: req.params.id, comment: foundComment});
        }
    });
});



// ======================================================
// Route: Update - Update comment in DB
// ======================================================
router.put("/:comment_id", middleware.checkCommentOwnership, middleware.validateComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/galleries/" + req.params.id );
        }
    });
});



// ======================================================
// Route: Destroy - Remove comment from DB
// ======================================================
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/galleries/" + req.params.id);
        }
    });
});


module.exports = router;
