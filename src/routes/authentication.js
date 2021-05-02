const express = require('express');
const routes = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const pool = require('../datebase');

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
//vista prefil
routes.get('/profile', isLoggedIn, async (req, res) => {
    const usuario = await pool.query('SELECT*FROM persona WHERE idpersona = ?',[req.user.fk_vendedor])
    res.render('profile',{usuario: usuario[0]});
});

//vista inicio
routes.get('/home', isLoggedIn, async(req, res) => {
    const totalEmpleados = await pool.query('select count(*) AS totalE from vendedor');
    const totalP = await pool.query('select count(*) AS totalP from productos');
    res.render('home',{total: totalEmpleados[0],totalP: totalP[0]});
});
//vista error
routes.get('/error404',(req, res) => {
    res.render('error404');
});
routes.get('/logout', isLoggedIn,(req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = routes;