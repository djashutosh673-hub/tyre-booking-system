function checkAuth(req, res, next) {

    // if session exists → allow
    if (req.session && req.session.user) {
        return next();
    }

    // otherwise redirect to login
    res.redirect('/login');
}

module.exports = checkAuth;
