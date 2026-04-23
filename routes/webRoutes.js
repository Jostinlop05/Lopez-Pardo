const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getWebs,
  createWeb,
  updateWeb,
  deleteWeb
} = require("../controllers/web.controller");

router.get("/", auth, getWebs);
router.post("/", auth, createWeb);
router.put("/:id", auth, updateWeb);
router.delete("/:id", auth, deleteWeb);

module.exports = router;