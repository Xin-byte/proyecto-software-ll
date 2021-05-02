const { serializeUser } = require("passport");

module.exports = {
    isLoggedIn(req, res, next){
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },
    isNotLoggedIn(req, res, next){
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('home');
    },
    isAdmin(req, res, next){
        if (req.user.tipo_usuario) {
            return next();
        }
        return res.redirect('/error404')
    }
}