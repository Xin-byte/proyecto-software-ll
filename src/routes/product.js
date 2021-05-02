const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn,isAdmin } = require('../lib/auth');
const fs = require('fs');
const carbone = require('carbone');
const helpers = require('../lib/helpers');
const path = require('path');
const { json } = require('express');
//productos vista
router.get('/product', isLoggedIn, async (req, res) => {
    const product = await pool.query('SELECT*FROM cat_prod');
    res.render('links/product', {product: product});
});
//insertar categorias
router.post('/product', isLoggedIn, async (req, res) => {
    const { categoria } = req.body;
    const newCatergoria = {
        categoria
    };
    const valid = await pool.query('SELECT*FROM cat_prod WHERE categoria = ?',[categoria]);
    if (valid[0]==null) {
        await pool.query('INSERT INTO cat_prod set ?',[newCatergoria]);
        req.flash('guardado', 'Categoria agregado correctamente');
    } else {
        req.flash('guardado', 'La categoria '+categoria+' ya esta registrada');
    }
    res.redirect('/links/product');
});
//editar categoria
router.get('/editP/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const categoria = await pool.query('SELECT*FROM cat_prod WHERE id_categoria = ?', [id]);
    //console.log(categoria[0]);
    res.render('links/editP', {categoria: categoria[0]})
});

router.post('/editP/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { categoria } = req.body;
    const categoriaActualizada = {
        categoria
    };
    //console.log(datosActualizados);
    await pool.query('UPDATE cat_prod set ? WHERE id_categoria = ?',[categoriaActualizada, id]);
    req.flash('guardado', 'Categoria actualizada correctamente');
    res.redirect('/links/product');
});

//reporte 
router.get('/report', isLoggedIn, async (req, res) => {
    const product = await pool.query('SELECT*FROM cat_prod');
    //console.log(pro)
    var data = {
        firstname: {name: 'John',name:'asda'},
        lastname : 'Doe'
    };
    
    let options = {
        convertTo: 'pdf' //can be docx, txt, ...
    }
      // Generate a report using the sample template provided by carbone module
      // This LibreOffice template contains "Hello {d.firstname} {d.lastname} !"
      // Of course, you can create your own templates!
    carbone.render('./node_modules/carbone/examples/simple.odt', data, options,(err, res) => {
        if (err) {
          return console.log(err);
        }
        // write the result
        fs.writeFileSync('./result.pdf', res);
    });

    res.download('./result.pdf');
});

module.exports = router;
