const mongoose = require("mongoose");

const webSchema = new mongoose.Schema({
  titulo: String,
  color: String,
  contenido: String,
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Web", webSchema);