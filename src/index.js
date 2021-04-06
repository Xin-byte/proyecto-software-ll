const express = require('express');
const morgan = require('morgan');

//inicializacion
const app = express();

//configuraciones
app.set('port', process.env.PORT || 4000);

//Consultas
app.use(morgan('dev'));

//Variables Globales


//Rutas

//Archivos publicos

//Inicio de servidor
app.listen(app.get('port'), () => {
    console.log('Server corriendo en el puerto', app.get('port'));
});