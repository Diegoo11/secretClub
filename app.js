const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/user');
const bcryptjs = require('bcryptjs');

dotenv.config('./.env');
const port = process.env.PORT;
const mongoDb = process.env.mongoDb;

const indexRouter = require('./routers/index')

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "mongo connection error"));

passport.use(
  new LocalStrategy((email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if(err) {
        return done(err)
      }
      if(!user) {
        return done(null, false, { message: "Incorrect username"});
      }
      bcryptjs.compare(password, user.password, (err, res) => {
        if(res) {
          return done(null, user);
        } else {
          console.log("I password")
          return done(null, false, { message: "Incorrec password" });
        }
      })
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
  })
});

const app = express();

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false}));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(port, () => console.log("app listening a port!"));