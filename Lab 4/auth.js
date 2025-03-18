let sessions = [];
function auth(roles) {
  console.log(sessions);
  return function (req, res, next) {
    if (req.cookies.sid && sessions[req.cookies.sid]) {
      const user = sessions[req.cookies.sid];
      if (roles && roles.indexOf(user.role) > -1) {
        req.user = user;
        next();
      } else {
        res.status(401).send("Insufficient permission.");
      }
    } else {
      res.status(401).send("You are not logged in.");
    }
  };
}

module.exports = { checkAuth: auth, sessions: sessions };
