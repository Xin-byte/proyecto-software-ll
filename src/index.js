const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

//inicializacion
const app = express();

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Consultas
app.use(morgan('dev'));
app.use(express.urlencoded({
    extends: false
}));
app.use(express.json());
//Variables Globales
app.use((req, res, next) =>{
    next();
});

//Rutas
app.use(require('./routes'));

//Archivos publicos

//Inicio de servidor
app.listen(app.get('port'), () => {
    console.log('Server corriendo en el puerto', app.get('port'));
});