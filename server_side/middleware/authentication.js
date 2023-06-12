const { validateToken } = require("../services/authentication");

async function authenticationMiddleware (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token." });
  }

  try {
    const payload = validateToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Wrong token." });
  }
}

module.exports = authenticationMiddleware;
