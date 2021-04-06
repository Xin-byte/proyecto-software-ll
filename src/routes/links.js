const express = require('express');
const routes = express.Router();

const pool = require('../datebase');

routes.get('/add', (req, res) => {
    res.render('links/add');
});

module.exports = routes;