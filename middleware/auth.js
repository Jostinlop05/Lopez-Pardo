const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  // Verificar si hay token
  if (!token) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar datos del usuario
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};