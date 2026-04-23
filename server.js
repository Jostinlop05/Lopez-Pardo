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
    <h1>Webs Personalizables</h1>

    <h2>Login</h2>
    <input id="email" placeholder="Email"><br><br>
    <input id="password" placeholder="Password"><br><br>
    <button onclick="login()">Login</button>

    <h2>Crear Web</h2>
    <input id="titulo" placeholder="Título"><br><br>
    <input id="color" placeholder="Color"><br><br>
    <input id="contenido" placeholder="Contenido"><br><br>
    <button onclick="crearWeb()">Crear</button>

    <script>
      async function login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        localStorage.setItem("token", data.token);

        alert("Login exitoso");
      }

      async function crearWeb() {
        const titulo = document.getElementById("titulo").value;
        const color = document.getElementById("color").value;
        const contenido = document.getElementById("contenido").value;

        const token = localStorage.getItem("token");

        const res = await fetch("/api/webs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({ titulo, color, contenido })
        });

        const data = await res.json();
        alert(JSON.stringify(data));
      }
    </script>
  `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});