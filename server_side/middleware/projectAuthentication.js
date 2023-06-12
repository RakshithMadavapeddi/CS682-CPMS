const { validateToken } = require("../services/authentication");

async function projectAuthenticationMiddleware (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token." });
  }

  try {
    const payload = validateToken(token);
    if (payload.role === "STUDENT") {
        return res.status(401).json({ error: "Student cannot access"});
    }
    req.user = payload;
    return next();
    
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Wrong token." });
  }
}

module.exports = projectAuthenticationMiddleware;