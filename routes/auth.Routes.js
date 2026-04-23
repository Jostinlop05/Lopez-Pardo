const express = require("express");
const router = express.Router();

// Importar controlador
const { register, login } = require("../controllers/auth.controller");

// Rutas
router.post("/register", register);
router.post("/login", login);

module.exports = router;