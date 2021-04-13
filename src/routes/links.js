const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn } = require('../lib/auth');
//para agregar
//vista home
router.get('/home', isLoggedIn,(req, res) => {
    res.render('links/home');
});
//Eviar datos  a la base de datos
router.post('/add', isLoggedIn,async (req, res) => {
    const { DNI, Nombres, ApellidoP, ApellidoM, correo, telefono } = req.body;
    const newLinks = {
        Nombres,
        ApellidoP,
        ApellidoM,
        DNI,
        correo,
        telefono
    };

    const valid = await pool.query('SELECT*FROM personas WHERE DNI = ?', [newLinks.DNI]);
    console.log(valid[0]);
    
    if (valid[0]==null) {
        await pool.query('INSERT INTO personas set ?', [newLinks]);
        newLinks.id = result.insertId;
        console.log(newLinks.id);
        /*await pool.query('INSERT INTO cliente(personas_idpersonas) VALUES ('+newLinks.id+')');*/
        req.flash('guardado', 'Empleado agregado correctamente');
    } else {
        req.flash('guardado', 'El DNI ya esta registrado');
    }
    console.log(newLinks);
    res.redirect('/links/add');
});

//obter datos de la base de datos
router.get('/add', isLoggedIn, async (req, res) => {
    const personas = await pool.query('SELECT*FROM personas');
    res.render('links/add', {personas: personas});
});

//elimininado
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM personas WHERE idpersonas = ?',[id]);
    req.flash('guardado', 'Empleado eliminado correctamente');
    res.redirect('/links/add');
});
//editando
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const datos = await pool.query('SELECT*FROM personas WHERE idpersonas = ?', [id]);
    console.log(datos[0]);
    res.render('links/edit', {datos: datos[0]})
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { DNI, Nombres, ApellidoP, ApellidoM, correo, telefono } = req.body;
    const datosActualizados = {
        Nombres,
        ApellidoP,
        ApellidoM,
        DNI,
        correo,
        telefono
    };
    await pool.query('UPDATE personas set ? WHERE idpersonas = ?',[datosActualizados, id]);
    req.flash('guardado', 'Empleado actualizado correctamente');
    res.redirect('/links/add');
});
module.exports = router;