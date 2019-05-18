const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Validation

const validateProfileInput = require('../../validation/profile');

//Load profile model

const Profile = require('../../models/Profiles');

//Load user model

const User = require('../../models/Users');

//@route  GET api/profiles/test
//@desc   Tests profiles route
//@access Public

router.get('/test', (req, res)=> res.json({msg: 'Profile Works'}));

//@route  POST api/profiles
//@desc   Create User profile
//@access Private


router.post('/', passport.authenticate('jwt', {session: false}),
 (req,res)=>{

    const {errors, isValid } = validateProfileInput(req.body);

    //Check validation
    if(!isValid){
        //Return any error with 400 status
        return res.status(400).json(errors);
    }
     //Get fields
     const profileFields = {};
     profileFields.user = req.user.id;
     if(req.body.handle)profileFields.handle = req.body.handle;
     if(req.body.company)profileFields.company = req.body.company;
     if(req.body.website)profileFields.website = req.body.website;
     if(req.body.location)profileFields.location = req.body.location;
     if(req.body.handle)profileFields.bio = req.body.bio;
     if(req.body.handle)profileFields.status = req.body.status;
     if(req.body.githubusername)profileFields.githubusername = req.body.githubusername;

     //Skills - Split into Array

     if(typeof req.body.skills !== 'undefined'){
         profileFields.skills = req.body.skills.split(',');
     }

     //Social

     profileFields.social = {};
     if(req.body.youtube)profileFields.social.youtube = req.body.youtube;
     if(req.body.twitter)profileFields.social.twitter = req.body.twitter;
     if(req.body.instagram)profileFields.social.instagram = req.body.instagram;
     if(req.body.facebook)profileFields.social.facebook = req.body.facebook;
     if(req.body.linkedin)profileFields.social.linkedin = req.body.linkedin;

     Profile.findOne({user: req.user.id}).then(profile => {
         if(profile){
             //Update
             Profile.findOneAndUpdate(
                 {user: req.user.id},
                 {$set: profileFields},
                 {new: true}
             ).then(profile => res.json(profile));
         }
         else{
             //Create

             //Check if handle exists

             Profile.findOne({handle: profileFields.handle}).then(profile => {
                 if(profile){
                     errors.handle = 'That handle already exists';
                     res.status(400).json(errors);
                 }

                 //Save Profile
                 new Profile(profileFields).save().then(profile => res.json(profile));
             });
         }
     });
     


}
);

module.exports = router;