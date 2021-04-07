const express = require('express');
const router = express.Router();

const pool = require('../datebase');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', (req, res) => {
    console.log(req.body);
    res.send('Recibido');
});

module.exports = router;