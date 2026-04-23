const express = require("express");
const router = express.Router();

// Importar controlador
const { register, login } = require("../Controllers/auth.controller");

// Rutas
router.post("/register", register);
router.post("/login", login);

module.exports = router;