'use strict';
const express = require('express');
const Profile = require('../models/profiles');
const middleware = require('../config/middleware');
const request = require('request');
const async  = require('async');
const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: imageFilter
});

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "enovatelab",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/web-devs', (req, res, next) => {
  Profile.find({}, (err, profiles) => {
    if(err) {
      console.log(err);
    } else {
      res.render('web-dev/index', {profiles: profiles, currentUser: req.user});
    }
  });
});

router.get('/web-devs/:id', (req, res, next) => {
  Profile.findById(req.params.id, (err, profile) => {
    if(err){
      console.log(err)
    } else {
      res.render('web-dev/show', {profile: profile, currentUser: req.user});
    }
  });
});

router.get("/new", middleware.isLoggedn,  (req, res, next) => {
  res.render('web-dev/new');
});

router.post('/web-devs', middleware.isLoggedn, upload.single('image'), (req, res, next) => {
  cloudinary.v2.uploader.upload(
    req.file.path,
    {
      width: 1500,
      height: 1000,
      crop: "scale"
    },
    function(err, result) {
      if (err) {
        req.flash("error", err.message);
        return res.render("error");
      }
      if(req.file.path == undefined) {
        req.flash("error", "Image shouldn't be empty!!");
        return res.redirect("back");
      }
      req.body.profile.image = result.secure_url;
      req.body.profile.imageId = result.public_id;
      req.body.profile.author = {
        id: req.user._id,
        username: req.user.username
      };
        Profile.create(req.body.profile, function(err, profile) {
          if (err) {
            req.flash("error", err.message);
            return res.render("error");
          }
          res.redirect("/web-devs");
        });
    },
    {
      moderation: "webpurify"
    }
  );
});

router.get('/:id/edit', middleware.isLoggedn, middleware.checkProfileOwnership, (req, res, next) => {
  Profile.findById(req.params.id, (err, profile) => {
    if(err) {
      console.log(err);
      res.redirect('back')
    } else {
      res.render('web-dev/edit', {profile: profile, currentUser: req.user});
    }
  });
});

// router.put('/web-devs/:id', middleware.isLoggedn, upload.single('image'), (req, res, next) => {
//   Profile.findByIdAndUpdate(req.params.id, req.body.profile, async (err, profile) => {
//     if(err) {
//       req.flash("error", err.message);
//       res.redirect("back");
//     } else {
//       if(req.file) {
//         try {
//         await cloudinary.v2.uploader.destroy(profile.imageId);
//           var result = await cloudinary.v2.uploader.upload(
//             req.file.path,
//             {
//               width: 1500,
//               height: 1000,
//               crop: "scale"
//             },
//             {
//               moderation: "webpurify"
//             }
//           );
//           profile.imageId = result.public_id;
//           profile.image = result.secure_url
//         } catch (err) {
          // req.flash("error", err.message);
          // return res.render("error");
//         }
//       }
      // profile.save();
      // req.flash("success", "Successfully updated your campground!");
      // console.log(profile);
      // res.redirect("/web-devs/" + req.params.id);
//     }
//   });
// });

router.put("/web-devs/:id", middleware.isLoggedn, middleware.checkProfileOwnership, upload.single('image'),
 function(req, res){
  Profile.findByIdAndUpdate(req.params.id, req.body.profile, async function(err, profile){
      if(err){
          req.flash("error", err.message);
          res.redirect("back");
      } else {
          if (req.file) {
            try {
            await cloudinary.v2.uploader.destroy(profile.imageId);        
              let result = await cloudinary.v2.uploader.upload(req.file.path);
              profile.imageId = result.public_id;
              profile.image = result.secure_url;    
            } catch(err) {
              req.flash("error", err.message);
              return res.render("error");
             }
            }
            profile.save();
            req.flash("success", "Successfully updated your profile!");
            res.redirect("/web-devs");
          }
  });
});

router.delete('/web-devs/:id', middleware.isLoggedn, middleware.checkProfileOwnership, (req, res, next) => {
  Profile.findByIdAndRemove(req.params.id, async function(err, profile) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
      await cloudinary.v2.uploader.destroy(profile.imageId);
      profile.remove();
      req.flash("success", `Successfully ${req.user.username} deleted!`);
      res.redirect("/web-devs");
    } catch (err) {
      if (err) {
        req.flash("error", err.message);
        return res.render("error");
      }
    }
  });
});


router.get('/anderoid-devs', (req, res, next) => {
  res.send('Wellcome to Anderoid-devs IProfiles');
});

router.get('/softwere-devs', (req, res, next) => {
  res.send('Wellcome to -Softwere IProfiles');
});



module.exports = router;
