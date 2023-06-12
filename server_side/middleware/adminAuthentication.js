const { validateToken } = require("../services/authentication");

async function adminAuthentication (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token." });
  }

  try {
    const payload = validateToken(token);
    if (payload.role === "ADMIN") {
        req.user = payload;
        return next();    
    } else {
        return res.status(401).json({ error: "Access restricted"});
    }
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Wrong token." });
  }
}

module.exports = adminAuthentication;