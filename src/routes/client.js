const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn,isAdmin } = require('../lib/auth');

const helpers = require('../lib/helpers');

//Eviar datos  a la base de datos cliente
router.post('/add', isLoggedIn,async (req, res) => {
    const { DNI, Nombres, ApellidoP, ApellidoM, direccion,correo, telefono } = req.body;
    const newLinks = {
        Nombres,
        ApellidoP,
        ApellidoM,
        DNI,
        direccion,
        correo,
        telefono
    };

    const valid = await pool.query('SELECT*FROM persona WHERE DNI = ?', [DNI]);
    const validTel = await pool.query('SELECT*FROM persona WHERE telefono =?', [telefono]);
    const validEmail = await pool.query('SELECT*FROM persona WHERE correo = ?', [correo]);
    //console.log(valid[0]);
    
    if (valid[0]==null && validTel[0]==null && validEmail[0]==null) {
        const result = await pool.query('INSERT INTO persona set ?', [newLinks]);
        newLinks.id = result.insertId;
        //console.log(newLinks.id);
        await pool.query('INSERT INTO cliente(fk_cliente) VALUES ('+newLinks.id+')');
        req.flash('guardado', 'Cliente agregado correctamente');
    } else if(valid[0]!=null) {
        req.flash('guardado', 'El DNI: '+DNI+' ya esta registrado');
    } else if(validTel[0]!=null) {
        req.flash('guardado', 'El telefono '+telefono+' ya esta registrado');
    } else if(validEmail[0]!=null) {
        req.flash('guardado', 'El correo '+correo+'ya esta registrado');
    }    
    //console.log(newLinks);
    res.redirect('/links/add');
});

//obter datos de la base de datos cliente
router.get('/add', isLoggedIn, async (req, res) => {
    const personas = await pool.query('SELECT*FROM vista_cliente');
    res.render('links/add', {personas: personas});
});

//elimininado
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM persona WHERE idpersona = ?',[id]);
    req.flash('guardado', 'Cliente eliminado correctamente');
    res.redirect('/links/add');
});
//editando
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const datos = await pool.query('SELECT*FROM persona WHERE idpersona = ?', [id]);
    console.log(datos[0]);
    res.render('links/edit', {datos: datos[0]})
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { DNI, Nombres, ApellidoP, ApellidoM, direccion, correo, telefono } = req.body;
    const datosActualizados = {
        Nombres,
        ApellidoP,
        ApellidoM,
        DNI,
        correo,
        telefono,
        direccion
    };
    //console.log(datosActualizados);
    await pool.query('UPDATE persona set ? WHERE idpersona = ?',[datosActualizados, id]);
    req.flash('guardado', 'Cliente actualizado correctamente');
    res.redirect('/links/add');
});

module.exports = router;
