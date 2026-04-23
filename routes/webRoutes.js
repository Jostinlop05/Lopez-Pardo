const express = require("express");
const router = express.Router();

// Middleware
const auth = require("../middleware/auth");

// Controlador
const {
  getWebs,
  createWeb,
  updateWeb,
  deleteWeb
} = require("../controllers/web.controller");

// Rutas protegidas
router.get("/", auth, getWebs);
router.post("/", auth, createWeb);
router.put("/:id", auth, updateWeb);
router.delete("/:id", auth, deleteWeb);

module.exports = router;