const express = require('express');
const router = express.Router();

const pool = require('../datebase');
const { isLoggedIn,isAdmin } = require('../lib/auth');

const helpers = require('../lib/helpers');
//productos vista
router.get('/salesDetail/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    //const categoria = await pool.query('SELECT*FROM cat_prod WHERE id_categoria = ?', [id]);
    const detail = await pool.query('SELECT*FROM vista_detallpedido WHERE idpedido = ?', [id]);
    const pedido = await pool.query('SELECT*FROM pedido WHERE idpedido = ?', [id]);
    const product = await pool.query('SELECT*FROM productos');
    res.render('links/salesDetail', {detail: detail,estado: pedido[0],product: product});
    //console.log(categoria);
});
//agregar producto 
router.post('/salesDetail/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { cantidad,fk_idproductos } = req.body;
    const fk_idpedido = id;
    const newProducto = {
        cantidad,
        fk_idpedido,
        fk_idproductos
    };

    const valid = await pool.query('SELECT*FROM vista_detallpedido WHERE idproductos = ? AND idpedido = ?',[newProducto.fk_idproductos,id]);
    
    if (valid[0]==null) {
        await pool.query('INSERT INTO detalle_pedido set ?',[newProducto]);
        req.flash('guardado', 'Producto agregado correctamente');
    } else {
        var newcantida = parseInt(cantidad) + parseInt(valid[0].cantidad);
        await pool.query('UPDATE detalle_pedido SET cantidad = ?  WHERE id_detalle_pedido = ?',[newcantida,valid[0].id_detalle_pedido]);
        req.flash('guardado', 'Producto agregado correctamente');
    }
    res.redirect('/links/salesDetail/'+id);
});
//agregar producto 
router.post('/modal/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await pool.query('UPDATE pedido SET estado = ?  WHERE idpedido = ?',[estado, id]);
    
    req.flash('guardado', 'Venta confirmada correctamente');
    res.redirect('/links/salesDetail/'+id);
});
//eliminar Pedido
router.get('/deleteC/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM pedido WHERE idpedido = ?',[id]);
    
    req.flash('message', 'Pedido cancelado correctamente');
    res.redirect('/links/sales');
});
//eliminar PRODUCTO DEL DETALLE Pedido
//ip = id del pedido
router.get('/deletePD/:id&:ip', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { ip } = req.params;
    await pool.query('DELETE FROM detalle_pedido WHERE id_detalle_pedido = ?',[id]);
    req.flash('guardado', 'Producto eliminado correctamente');
    res.redirect('/links/salesDetail/'+ip);
});
module.exports = router;
