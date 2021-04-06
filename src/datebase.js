const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./key');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexion con la base de dataos fue crrada');
        }else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene conexiones');
        }else if (err.code === 'ECONNREFUSED') {
            console.error('La conexion ha sido rechazada');
        }
    }
    if(connection) connection.release;
    console.log('Conexion establecida');
    return;

});
//promesas a callbback
pool.query = promisify(pool.query);
module.exports = pool;
