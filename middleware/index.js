var Gallery          = require("../models/gallery"),
    Comment          = require("../models/comment");


// ======================================================
// Middleware v2.00
// ======================================================
module.exports = {


// ======================================================
// >>>> Are you logged in?
// ======================================================
isLoggedIn: function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
},


// ======================================================
// >>>> Is this your gallery?
// ======================================================
checkGalleryOwnership: function(req, res, next){
    if(req.isAuthenticated()){
        Gallery.findById(req.params.id, function(err, foundGallery){
           if(err){
               req.flash("error", "DB Error - Gallery not found!");
               res.redirect("back");
           } else {
               //does user own the gallery?
               if(foundGallery.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
},


// ======================================================
// >>>> Is this your comment?
// ======================================================
checkCommentOwnership: function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error", "DB Error - Gallery not found!");
               res.redirect("back");
           } else {
               //does user own the comment?
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
},


// ======================================================
// >>>> FORM VALIDATION
// ======================================================
validateComment: function(req, res, next){
  if(req.body.comment.text != ""){
      return next();
  }
  req.flash("error", "Where's the comment?");
  res.redirect("back");
}


};
