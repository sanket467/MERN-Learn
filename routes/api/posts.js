const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Loading models

const Post = require("../../models/Post");
const Profile = require("../../models/Profiles");

//Loading validation

const validatePostInput = require("../../validation/posts");

//@route  GET api/posts/test
//@desc   Tests post route
//@access Public

router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

//@route  POST api/posts
//@desc   Create posts
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route  GET api/posts
//@desc   Get all the posts
//@access Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json("No post found with the given ID"));
});

//@route  GET api/posts/:id
//@desc   Get posts by id
//@access Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found by the given ID" })
    );
});

//@route  DELETE api/posts/:id
//@desc   DELETE post by id
//@access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ noauthorized: "User not authorized" });
          }

          //Delete
          post.remove().then(() => res.json({ success: "true" }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route  POST api/posts/like/:id
//@desc   Like posts
//@access Private

router.delete(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
            if(
            post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0)
            {
                return res
                .status(401).json({alreadyliked : 'User already liked your post'});
            }

            //Add user to likes arrau

            post.like.unshift({user: req.user.id});
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

module.exports = router;
