const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  console.log("Header recibido:", header);

  if (!header) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  const token = header.split(" ")[1];

  console.log("Token extraído:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN DECODIFICADO:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("Error de JWT:", err.message);
    return res.status(401).json({ msg: "Token inválido" });
  }
};