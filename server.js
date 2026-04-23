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

          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWE2NTFhNjZmNjhkMGZkOWU0N2QzYiIsImlhdCI6MTc3Njk3NDE4MSwiZXhwIjoxNzc2OTc3NzgxfQ.t9NwCqbx7kYEyghXXAy82tOjJCPSOjB77QFyusjuUj8"; // 🔥 PON TU TOKEN REAL

          const res = await fetch("/api/webs", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            }
          });

          const data = await res.json();

          const lista = document.getElementById("lista");
          lista.innerHTML = "";

          if (!Array.isArray(data) || data.length === 0) {
            lista.innerHTML = "<p>No hay webs aún</p>";
            return;
          }

          data.forEach(w => {

            const card = document.createElement("div");
            card.style.border = "1px solid black";
            card.style.margin = "10px";
            card.style.padding = "10px";

            const titulo = document.createElement("h3");
            titulo.textContent = w.titulo;

            const color = document.createElement("p");
            color.innerHTML = "<b>Color:</b> " + w.color;

            const contenido = document.createElement("p");
            contenido.textContent = w.contenido;

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "✏️ Editar";
            btnEditar.onclick = function() {
              editarWeb(w._id);
            };

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "🗑️ Eliminar";
            btnEliminar.onclick = function() {
              eliminarWeb(w._id);
            };

            card.appendChild(titulo);
            card.appendChild(color);
            card.appendChild(contenido);
            card.appendChild(document.createElement("br"));
            card.appendChild(btnEditar);
            card.appendChild(btnEliminar);

            lista.appendChild(card);
          });

        } catch (err) {
          console.log("ERROR:", err);
          document.getElementById("lista").innerHTML =
            "<p style='color:red;'>Error al cargar webs</p>";
        }
      }

      async function eliminarWeb(id) {
        try {
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWE2NTFhNjZmNjhkMGZkOWU0N2QzYiIsImlhdCI6MTc3Njk3NDE4MSwiZXhwIjoxNzc2OTc3NzgxfQ.t9NwCqbx7kYEyghXXAy82tOjJCPSOjB77QFyusjuUj8";

          await fetch("/api/webs/" + id, {
            method: "DELETE",
            headers: {
              "Authorization": "Bearer " + token
            }
          });

          alert("Web eliminada");
          cargarWebs();

        } catch (err) {
          console.log(err);
        }
      }

      async function editarWeb(id) {
        const titulo = prompt("Nuevo título:");
        const color = prompt("Nuevo color:");
        const contenido = prompt("Nuevo contenido:");

        try {
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWE2NTFhNjZmNjhkMGZkOWU0N2QzYiIsImlhdCI6MTc3Njk3NDE4MSwiZXhwIjoxNzc2OTc3NzgxfQ.t9NwCqbx7kYEyghXXAy82tOjJCPSOjB77QFyusjuUj8";

          await fetch("/api/webs/" + id, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
              titulo,
              color,
              contenido
            })
          });

          alert("Web actualizada");
          cargarWebs();

        } catch (err) {
          console.log(err);
        }
      }

      window.onload = cargarWebs;
    </script>
  `);
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 http://localhost:" + PORT);
});