const express = require('express');
const routes = express.Router();

routes.get('/', (req, res)=> {
    res.send('Ya esta corriendo')
});

module.exports = routes;