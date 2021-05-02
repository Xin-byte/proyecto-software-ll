const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn,isAdmin } = require('../lib/auth');

const helpers = require('../lib/helpers');
//productos vista
router.get('/addProduct/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const categoria = await pool.query('SELECT*FROM cat_prod WHERE id_categoria = ?', [id]);
    const product = await pool.query('SELECT*FROM productos WHERE fk_tipoprod = ?', [id]);
    res.render('links/addProduct', {product: product, categoria: categoria[0]});
    //console.log(categoria);
});
//agregar producto 
router.post('/addProduct/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { nom_pro, descrip, precio, stock } = req.body;
    const fk_tipoprod = id;
    const newProducto = {
        nom_pro,
        descrip,
        precio,
        stock,
        fk_tipoprod
    };
    await pool.query('INSERT INTO productos(nom_pro, descrip, cod, precio, stock, fk_tipoprod) VALUES ("'+newProducto.nom_pro+'","'+newProducto.descrip+'",(SELECT randString(10)),"'+newProducto.precio+'","'+newProducto.stock+'",'+newProducto.fk_tipoprod+')');
    req.flash('guardado', 'Producto '+nom_pro+' agregado correctamente');
    res.redirect('/links/addProduct/'+id);
});
//actulizar Stock
router.post('/addStock/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    const product = await pool.query('SELECT*FROM productos WHERE idproductos = ?', [id]);
    var newStock = parseInt(product[0].stock)+parseInt(stock);
    await pool.query('UPDATE productos SET stock = ? WHERE idproductos =?',[newStock,id]);
    req.flash('guardado', 'Stock actualizado correctamente');
    res.redirect('/links/addProduct/'+product[0].fk_tipoprod);
    //console.log(categoria);
});

//delete producto
router.get('/deletePRO/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const productD = await pool.query('SELECT*FROM productos WHERE idproductos = ?', [id]);
    await pool.query('DELETE FROM productos WHERE idproductos = ?', [id]);
    req.flash('guardado', 'Producto eleminado correctamente');
    res.redirect('/links/addProduct/'+productD[0].fk_tipoprod);
    //console.log(categoria);
});

module.exports = router;
