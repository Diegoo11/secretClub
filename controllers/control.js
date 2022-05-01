const { body, validationResult } = require('express-validator');
const async = require('async');
const User = require('../models/user');
const Message = require('../models/message');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');

passport.use(
  new LocalStrategy(() => {
  })
);

exports.index = (req, res, next) => {
  Message.find().populate('user').exec((err, messages) => {
    if(err) {return next(err)}
    res.render('index', {messages: messages})
  })
};

exports.sign_in_get = (req, res, next) => {
  res.render('sign-in');
};

exports.sign_in_post = [
  body('name').trim().isLength({min: 3}).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').trim().isLength({min: 6}).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      admin: false
    })

    if(!errors.isEmpty()) {
      res.render('sign-in', { user: user, errors: errors});
      return;
    }

    bcryptjs.hash(req.body.password, 10, (err, hashed) => {
      if(err) {return next(err)};
      user.password = hashed;
      user.save((err) => {
        if(err) {return next(err)}
        res.redirect('/')
      })
    })
  }
]

exports.log_in_get = (req, res, next) => {
  if(req.user) {
    res.redirect('/')
  }
  res.render('log-in');
};

exports.log_in_post = [
  passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/sanpincho"
  })
]

exports.log_out_get = (req, res) => {
  req.logout();
  res.redirect('/');
}

exports.add_message_get = (req, res) => {
  res.render('add-message');
}

exports.add_message_post = [
  body('title').trim().isLength({min: 4}).escape(),
  body('text').trim().isLength({min: 4}).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      user: req.user._id,
      date: new Date,
      text: req.body.text,
      title: req.body.title
    })

    if(!errors.isEmpty()){
      res.render('add-message', {message: message, errors: errors});
      return;
    }

    message.save((err) => {
      if(err) {return next(err)}
      res.redirect('/')
    })
  }
]

exports.admin_get = (req, res, next) => {
  res.render('admin')
}

exports.admin_post = (req, res, next) => {
  User.findById(req.user._id).exec((err, user) => {
    if(err) {return next(err)}

    const newuser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
      admin: true,
      _id: user._id
    })

    User.findByIdAndUpdate(req.user._id, newuser, {}, (err, theuser) => {
      if(err) {return next(err)}
      res.redirect('/')
    })
  })
}

exports.delete = (req, res, next) => {
  console.log(req.params.id)
  if(req.user.admin){
    console.log('si es admin')
    Message.findByIdAndRemove(req.params.id, function deleteMessage(err) {
      if(err) {return next(err)}
      res.redirect('/')
    })
  }
  else {
    console.log('no es admin')
    res.redirect('/')
  }
}