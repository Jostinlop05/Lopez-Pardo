require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.log("❌ Error MongoDB:", err));

// Rutas
app.use("/api/auth", require("./routes/auth.Routes.js"));
app.use("/api/webs", require("./routes/webRoutes"));


app.get("/", (req, res) => {
  res.send(`
    <h1>Webs Registradas</h1>

    <div id="lista">Cargando webs...</div>

    <script>
      async function cargarWebs() {
        try {

          // 🔥 TOKEN
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWE2NTFhNjZmNjhkMGZkOWU0N2QzYiIsImlhdCI6MTc3Njk3NDE4MSwiZXhwIjoxNzc2OTc3NzgxfQ.t9NwCqbx7kYEyghXXAy82tOjJCPSOjB77QFyusjuUj8";
          console.log("TOKEN:", token);

          if (!token) {
            document.getElementById("lista").innerHTML =
              "<p style='color:red;'>No hay token. Haz login primero.</p>";
            return;
          }

          // 🔥 FETCH CORRECTO
          const res = await fetch("http://localhost:3000/api/webs", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          });

          const data = await res.json();

          console.log("RESPUESTA:", data);

          const lista = document.getElementById("lista");
          lista.innerHTML = "";

          if (!Array.isArray(data) || data.length === 0) {
            lista.innerHTML = "<p>No hay webs aún</p>";
            return;
          }

          for (let i = 0; i < data.length; i++) {
            const w = data[i];

            const div = document.createElement("div");

div.innerHTML =
  "<div style='border:1px solid black; margin:10px; padding:10px;'>" +
  "<h3>" + w.titulo + "</h3>" +
  "<p><b>Color:</b> " + w.color + "</p>" +
  "<p>" + w.contenido + "</p>" +

  "<br>" +
  "<button>✏️ Editar</button>" +
  "<button>🗑️ Eliminar</button>" +

  "</div>";

            lista.appendChild(div);
          }

        } catch (err) {
          console.log("ERROR:", err);
          document.getElementById("lista").innerHTML =
            "<p style='color:red;'>Error al cargar webs</p>";
        }
      }

      // 🔥 AUTO EJECUCIÓN
      window.onload = cargarWebs;
    </script>
  `);
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 http://localhost:" + PORT);
});