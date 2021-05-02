const express = require('express');
const routes = express.Router();

const { isNotLoggedIn } = require('../lib/auth');

routes.get('/', isNotLoggedIn, (req, res)=> {
    res.render('index');
});

module.exports = routes;