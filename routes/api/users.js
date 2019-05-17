const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load user model

const User = require('../../models/Users');

//@route  GET api/users/test
//@desc   Tests user route
//@access Public

router.get('/test', 
  (req, res) => res.json({msg: "users works"}));

//@route  POST api/users/register
//@desc   Register User
//@access Public

router.post('/register',(req, res)=>{
 User.findOne({
     email:req.body.email
 }).then(user => {
     if(user){
         return res.status(400).json({email: 'Email already exists'});
     }
     else{
         const avatar = gravatar.url(req.body.email ,
            {
                s:'200',
                r:'pg',
                d:'mm'
            });
         const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar,
            password: req.body.email
         });

         bcrypt.genSalt(10, (err, salt) => {
             bcrypt.hash(newUser.password, salt, (err, hash) => {
                 if(err) throw err;
                 newUser.password = hash;
                 newUser.save()
                   .then(user => res.json(user))
                   .catch(err => console.log(err));
             })
         })


     }
 });
}
);

//@route  POST api/users/login
//@desc   Login user / Return JWT
//@access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({email:email}).then(user => {
  //Check for user
  if(!user){
      return res.status(404).json({email: "User not found"});
  }

  //Check Password
  bcrypt.compare(password, user.password).then(isMatch => {
      console.log(isMatch);
      console.log(user);
      if(isMatch){
          res.json({msg: 'Success'});
      }else{
          return res.status(400).json({password: 'Password Incorrect'});
      }
  });
  });
});


module.exports = router;