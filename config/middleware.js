const Profile = require('../models/profiles');
const middlewareObj = {}

middlewareObj.isLoggedn = function(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be loggedd in to do that");
    res.redirect("/users/login");
}

middlewareObj.checkProfileOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Profile.findById(req.params.id, function(err, profile){
            if(err){
                req.flash("error", "Profile not found");
                res.redirect("/web-devs");
            } else {
                if(profile.author.id.equals(req.user._id)) {
                   next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("/web-devs");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/web-devs");
 }
}

module.exports = middlewareObj;