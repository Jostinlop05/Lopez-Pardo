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

    <button onclick="cargarWebs()">Ver Webs</button>

    <div id="lista"></div>

    <script>
      async function cargarWebs() {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Debes tener token (haz login antes)");
          return;
        }

        const res = await fetch("/api/webs", {
          headers: {
            "Authorization": token
          }
        });

        const webs = await res.json();

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        webs.forEach(w => {
          const div = document.createElement("div");

          div.innerHTML = \`
            <div style="border:1px solid black; margin:10px; padding:10px;">
              <h3>\${w.titulo}</h3>
              <p><b>Color:</b> \${w.color}</p>
              <p>\${w.contenido}</p>
            </div>
          \`;

          lista.appendChild(div);
        });
      }
    </script>
  `);
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 http://localhost:" + PORT);
});