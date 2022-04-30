const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const control = require('../controllers/control')

passport.use(
  new LocalStrategy(() => {
  })
);

router.get('/', control.index);

router.get('/sign-in', control.sign_in_get);

router.post('/sign-in', control.sign_in_post);

router.get('/log-in', control.log_in_get);

router.post('/log-in', control.log_in_post);

router.get('/log-out', control.log_out_get);

router.get('/add', control.add_message_get);

router.post('/add', control.add_message_post);

router.get('/admin', control.admin_get);

router.post('/admin', control.admin_post);

router.get('/delete/:id', control.delete);



module.exports = router;