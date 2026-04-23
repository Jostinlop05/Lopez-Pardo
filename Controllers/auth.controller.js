const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ======================
// REGISTRO
// ======================
exports.register = async (req, res) => {
  try {
    let { nombre, email, password } = req.body;

    email = email.toLowerCase().trim();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      email,
      password: hash
    });

    await user.save();

    res.status(201).json({ msg: "Usuario registrado" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};


// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    console.log("EMAIL BUSCADO:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Usuario no existe" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};