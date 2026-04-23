require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error("❌ Error MongoDB:", err));


app.use("/api/auth", require("./routes/auth.Routes.js"));


app.use("/api/webs", require("./routes/webRoutes"));


app.get("/", (req, res) => {
  res.send("API de sitios web personalizables 🚀");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});