const mongoose = require("mongoose");

const webSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  color: String,
  contenido: String,
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Web", webSchema);