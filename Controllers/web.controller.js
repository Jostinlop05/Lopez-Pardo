const Web = require("../models/Web");

// ======================
// OBTENER TODAS LAS WEBS
// ======================
exports.getWebs = async (req, res) => {
  try {
    console.log("USER DEL TOKEN:", req.user.id);

    // 🔥 TEMPORAL: trae todas para verificar
    const webs = await Web.find({});

    console.log("WEBS ENCONTRADAS:", webs.length);

    res.json(webs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ======================
// CREAR WEB
// ======================
exports.createWeb = async (req, res) => {
  try {
    const { titulo, color, contenido } = req.body;

    const web = new Web({
      titulo,
      color,
      contenido,
      usuarioId: req.user.id
    });

    await web.save();

    res.status(201).json(web);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ======================
// ACTUALIZAR WEB
// ======================
exports.updateWeb = async (req, res) => {
  try {
    const { id } = req.params;

    const web = await Web.findOneAndUpdate(
      { _id: id, usuarioId: req.user.id },
      req.body,
      { new: true }
    );

    if (!web) {
      return res.status(404).json({ msg: "Web no encontrada" });
    }

    res.json(web);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ======================
// ELIMINAR WEB
// ======================
exports.deleteWeb = async (req, res) => {
  try {
    const { id } = req.params;

    const web = await Web.findOneAndDelete({
      _id: id,
      usuarioId: req.user.id
    });

    if (!web) {
      return res.status(404).json({ msg: "Web no encontrada" });
    }

    res.json({ msg: "Web eliminada correctamente" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};