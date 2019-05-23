const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Loading models

const Post = require('../../models/Post');

//Loading validation

const validatePostInput = require('../../validation/posts');

//@route  GET api/posts/test
//@desc   Tests post route
//@access Public

router.get('/test', (req, res) => res.json({msg: 'Posts Works'}));

//@route  POST api/posts
//@desc   Create posts
//@access Private

router.post('/', passport.authenticate('jwt', {session : false}), (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));

}); 



module.exports = router;