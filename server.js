const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

const app = express();

//Bodyparser middle ware

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB Config 
const db =  require('./config/keys').mongoURI;

//Connect to mongoose
mongoose
   .connect(db)
   .then(()=> console.log('MongoDB connected'))
   .catch(err=> console.log(err));

//Passport Middleware

app.use(passport.initialize());

//Passport Config

require('./config/passport')(passport);
//Use Routes

app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log('Server running on port ' + port));