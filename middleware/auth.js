module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  console.log("Header recibido:", header); // 🔥 MIRA ESTO EN LA TERMINAL

  if (!header) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  const token = header.split(" ")[1];
  console.log("Token extraído:", token); // 🔥 MIRA ESTO EN LA TERMINAL

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Error de JWT:", err.message); // 🔥 ESTO TE DIRÁ POR QUÉ FALLA
    return res.status(401).json({ msg: "Token inválido" });
  }
};