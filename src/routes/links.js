const express = require('express');
const router = express.Router();

const pool = require('../datebase');
//para agregar
//Eviar datos  a la base de datos
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
    res.redirect('/links/add');
});

//obter datos de la base de datos
router.get('/add', async (req, res) => {
    const personas = await pool.query('SELECT*FROM personas');
    res.render('links/add', {personas: personas});
});

//elimininado
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM personas WHERE idpersonas = ?',[id]);
    res.redirect('/links/add');
});
//editando
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const datos = await pool.query('SELECT*FROM personas WHERE idpersonas = ?', [id]);
    console.log(datos[0]);
    res.render('links/edit', {datos: datos[0]})
});

module.exports = router;