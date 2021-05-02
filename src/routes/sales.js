const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn,isAdmin } = require('../lib/auth');

const helpers = require('../lib/helpers');

//Vista Servicios
router.get('/sales', isLoggedIn, async (req, res) => {
    const sales = await pool.query('SELECT*FROM vista_ventas');
    const usuario = await pool.query('SELECT*FROM persona WHERE idpersona = ?',[req.user.fk_vendedor])
    const client = await pool.query('SELECT*FROM vista_cliente');
    res.render('links/sales', {sales: sales,usuario: usuario[0],client: client});
    //console.log(req.user.fk_vendedor);
    //console.log(usuario);
});
//Eviar datos  a la base de datos Servicios
router.post('/sales', isLoggedIn, async (req, res) => {
    const { monto,fk_cliente, fk_vendedor,estado } = req.body;
    const newPedido = {
        monto,
        estado,
        fk_cliente,
        fk_vendedor,
    };
    const result = await pool.query('INSERT INTO pedido set ?',[newPedido]);
    newPedido.id = result.insertId;
    await pool.query('INSERT INTO venta(fk_idpedido) VALUES ('+newPedido.id+')');
    req.flash('guardado', 'Pedido agregado correctamente');
    res.redirect('/links/salesDetail/'+newPedido.id);
});

module.exports = router;