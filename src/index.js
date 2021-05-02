const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./key');


//inicializacion
const app = express();
require('./lib/passport');

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
app.use(session({
    secret: 'xinsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({
    extends: false
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
    app.locals.guardado = req.flash('guardado');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/client'));
app.use('/links',require('./routes/employee'));
app.use('/links',require('./routes/product'));
app.use('/links',require('./routes/services'));
app.use('/links',require('./routes/sales'));
app.use('/links',require('./routes/addProduct'));
app.use('/links',require('./routes/salesDetail'));
app.use('/partials',require('./routes/salesDetail'));
//app.use('/links',require('./routes/report'));
//Archivos publicos
app.use(express.static(path.join(__dirname, 'public')));

//Inicio de servidor
app.listen(app.get('port'), () => {
    console.log('Server corriendo en el puerto', app.get('port'));
});