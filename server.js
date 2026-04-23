require("dotenv").config(); // Variables de entorno

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/** ------------------------------
 * Middleware
 * ------------------------------ */
app.use(cors());
app.use(express.json());

/** ------------------------------
 * Conexión a MongoDB
 * ------------------------------ */
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Error MongoDB:", err));

/** ------------------------------
 * Rutas
 * ------------------------------ */

// Auth
app.use("/api/auth", require("./routes/auth.routes"));

// Webs (ANTES animals)
app.use("/api/webs", require("./routes/webRoutes"));

/** ------------------------------
 * Ruta base
 * ------------------------------ */
app.get("/", (req, res) => {
  res.send("API de sitios web personalizables 🚀");
});

/** ------------------------------
 * Servidor
 * ------------------------------ */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});