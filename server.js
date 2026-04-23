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
    <h1>Login</h1>

    <input id="email" placeholder="Email"><br><br>
    <input id="password" type="password" placeholder="Password"><br><br>
    <button onclick="login()">Iniciar sesión</button>
    <button onclick="logout()">Cerrar sesión</button>

    <hr>

    <h2>Crear nueva web</h2>

    <div id="crearWebForm" style="display:none;">
      <input id="titulo" placeholder="Título"><br><br>
      <input id="color" placeholder="Color"><br><br>
      <textarea id="contenido" placeholder="Contenido"></textarea><br><br>

      <button onclick="crearWeb()">➕ Crear Web</button>
    </div>

    <hr>

    <h1>Webs Registradas</h1>
    <div id="lista">Cargando webs...</div>

    <script>

      function verificarSesion() {
        const token = localStorage.getItem("token");
        const form = document.getElementById("crearWebForm");

        if (token) {
          form.style.display = "block";
        } else {
          form.style.display = "none";
        }
      }

      async function login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          });

          const data = await res.json();

          if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login exitoso");

            verificarSesion();
            cargarWebs();
          } else {
            alert(data.msg);
          }

        } catch (err) {
          console.log(err);
        }
      }

      function logout() {
        localStorage.removeItem("token");
        alert("Sesión cerrada");

        verificarSesion();
        cargarWebs();
      }

      async function crearWeb() {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            alert("Debes iniciar sesión");
            return;
          }

          const titulo = document.getElementById("titulo").value;
          const color = document.getElementById("color").value;
          const contenido = document.getElementById("contenido").value;

          if (!titulo || !color || !contenido) {
            alert("Completa todos los campos");
            return;
          }

          await fetch("/api/webs", {
            method: "POST",
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

          alert("Web creada");

          document.getElementById("titulo").value = "";
          document.getElementById("color").value = "";
          document.getElementById("contenido").value = "";

          cargarWebs();

        } catch (err) {
          console.log(err);
        }
      }

      async function cargarWebs() {
        try {
          const token = localStorage.getItem("token");

          if (!token) {
            document.getElementById("lista").innerHTML =
              "<p style='color:red;'>Debes iniciar sesión</p>";
            return;
          }

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
          const token = localStorage.getItem("token");

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
          const token = localStorage.getItem("token");

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

      window.onload = function() {
        verificarSesion();
        cargarWebs();
      };

    </script>
  `);
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 http://localhost:" + PORT);
});