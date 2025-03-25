function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  let token = null;

  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    token = bearerHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    req.token = token;
    next();
  } else {
    if (req.method == "GET") {
      res.status(403).redirect("/login");
    } else {
      res.status(403).json({ msg: "Unauthorized" });
    }
  }
}

module.exports = { verifyToken };
