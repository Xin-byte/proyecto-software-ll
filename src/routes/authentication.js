const express = require('express');
const routes = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

routes.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});


routes.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

routes.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

routes.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req , res, next);
});

routes.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

routes.get('/logout', isLoggedIn,(req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = routes;