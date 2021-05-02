const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool= require('../datebase');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
    const rows = await pool.query('SELECT * FROM credencial WHERE usuario = ?', [usuario]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contraseña, user.contraseña);
        if (validPassword & user.estado) {
            done(null, user, req.flash('guardado','Bienvenido '+user.usuario))
        }else if (user.estado == false){
            done(null, false, req.flash('message','Usuario inactivo'));
        }else{
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    }else{
        return done(null, false, req.flash('message','El usuario no existe'));
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async (req, usuario, contraseña,done) => {
    const {tipo_usuario,fk_vendedor} = req.body;
    const newUser = {
        usuario,
        contraseña,
        tipo_usuario,
        fk_vendedor
    };
    //console.log(newUser);
    newUser.contraseña = await helpers.encryptPassword(contraseña);
    const result = await pool.query('INSERT INTO credencial SET ?', [newUser]);
    newUser.id = result.insertId;
    //console.log(newUser.id);
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("SELECT * FROM credencial WHERE idcredencial = ?", [id]);
  done(null, rows[0]);
});
