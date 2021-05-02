const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn,isAdmin } = require('../lib/auth');

const helpers = require('../lib/helpers');

//Eviar datos  a la base de datos Empleado
router.post('/employee', isLoggedIn,async (req, res) => {
    const { DNI, Nombres, ApellidoP, ApellidoM, correo, direccion, telefono, usuario, contraseña, tipo_usuario, estado } = req.body;
    const newLinks = {
        Nombres,
        ApellidoP,
        ApellidoM,
        DNI,
        correo,
        direccion,
        telefono
    };

    //console.log(newCredencial);
    const valid = await pool.query('SELECT*FROM persona WHERE DNI = ?', [DNI]);
    const validTel = await pool.query('SELECT*FROM persona WHERE telefono =?', [telefono]);
    const validEmail = await pool.query('SELECT*FROM persona WHERE correo = ?', [correo]);
    const validUser = await pool.query('SELECT*FROM credencial WHERE usuario = ?', [usuario]);
    //console.log(valid[0]);
    if (valid[0]==null && validTel==null && validEmail==null && validUser[0]==null) {
        const result = await pool.query('INSERT INTO persona set ?', [newLinks]);
        newLinks.id = result.insertId;
        const fk_vendedor = newLinks.id;
        //console.log(newLinks.id);
        const newCredencial = {
            usuario,
            contraseña,
            tipo_usuario,
            estado,
            fk_vendedor
        };
        newCredencial.contraseña = await helpers.encryptPassword(contraseña);
        await pool.query('INSERT INTO vendedor(fk_vendedor) VALUES ('+newLinks.id+')');

        await pool.query('INSERT INTO credencial set?',[newCredencial]);
        
        req.flash('guardado', 'Empleado agregado correctamente');
    } else if(valid[0]!=null) {
        req.flash('guardado', 'El DNI: '+DNI+' ya esta registrado');
    } else if(validTel[0]!=null) {
        req.flash('guardado', 'El telefono '+telefono+' ya esta registrado');
    } else if(validEmail[0]!=null) {
        req.flash('guardado', 'El correo '+correo+'ya esta registrado');
    } else if(validUser[0]!=null) {
        req.flash('guardado', 'El usuario '+usuario+' ya esta registrado');
    }
    //console.log(newLinks);
    res.redirect('/links/employee');
});

//empleados vista
router.get('/employee', [isLoggedIn,isAdmin],async (req, res) => {
    const empleados = await pool.query('SELECT*FROM vista_emplead');
   
    res.render('links/employee', {empleados: empleados});
});
//cambio de estado
router.post('/status/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await pool.query('UPDATE credencial SET estado = ? WHERE fk_vendedor = ?', [estado,id]);
    res.redirect('/links/employee');
});

//edit Empleados
router.get('/editE/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const datosE = await pool.query('SELECT*FROM personas WHERE idpersonas = ?', [id]);
    const datosC = await pool.query('SELECT*FROM credencial WHERE idpersonas = ?', [id]);
    console.log(datos[0]);
    res.render('links/editE', {datosE: datosE[0],datosC: datosC[0]})
});

//empleados eliminar
router.get('/deleteE/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM persona WHERE idpersona = ?',[id]);
    req.flash('guardado', 'Empleado eliminado correctamente');
    res.redirect('/links/employee');
});

module.exports = router;
