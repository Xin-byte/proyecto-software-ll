const express = require('express');
const router = express.Router();

const pool = require('../datebase');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { DNI, Nombres, ApellidoP, ApellidoM, correo, telefono } = req.body;
    const newLinks = {

        Nombres,
        ApellidoP,
        ApellidoM,
        DNI,
        correo,
        telefono
    };
    await pool.query('INSERT INTO personas set ?', [newLinks]);
    //console.log(newLinks);
    res.send('Recibido');
});

router.get('/add', async (req, res) => {
    const listapersonas = await pool.query('SELECT*FROM personas');
    res.render('links/add', { listapersonas });
});

module.exports = router;