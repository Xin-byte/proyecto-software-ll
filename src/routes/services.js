const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn,isAdmin } = require('../lib/auth');

const helpers = require('../lib/helpers');

//Eviar datos  a la base de datos Servicios
//Vista Servicios
router.get('/servis', isLoggedIn, async (req, res) => {
    const servis = await pool.query('SELECT*FROM servicios');
    res.render('links/servis', {servis: servis});
});

module.exports = router;
