exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Admin access required');
  res.redirect('/auth/login');
};

exports.isMechanic = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'mechanic') {
    return next();
  }
  req.flash('error', 'Access denied. Mechanic only.');
  res.redirect('/');

};

exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error', 'Please login first');
  res.redirect('/auth/login');
};