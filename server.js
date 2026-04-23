require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error MongoDB:", err));

// Rutas (RESPETANDO TU R MAYÚSCULA)
app.use("/api/auth", require("./routes/auth.Routes.js"));
app.use("/api/webs", require("./routes/webRoutes"));

// Vista en navegador
app.get("/", (req, res) => {
  res.send(`
    <h1>API Webs Personalizables 🚀</h1>
    <p>Servidor funcionando correctamente</p>
    <ul>
      <li>POST /api/auth/register</li>
      <li>POST /api/auth/login</li>
      <li>GET /api/webs</li>
      <li>POST /api/webs</li>
    </ul>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});