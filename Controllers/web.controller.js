const Web = require("../models/Web");

// OBTENER TODAS LAS WEBS
exports.getWebs = async (req, res) => {
  try {
    const webs = await Web.find({ usuarioId: req.user.id });
    res.json(webs);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener webs" });
  }
};

// CREAR WEB
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
    res.json(web);
  } catch (err) {
    res.status(500).json({ msg: "Error al crear web" });
  }
};

// ACTUALIZAR WEB
exports.updateWeb = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Web.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar web" });
  }
};

// ELIMINAR WEB
exports.deleteWeb = async (req, res) => {
  try {
    const { id } = req.params;

    await Web.findByIdAndDelete(id);

    res.json({ msg: "Web eliminada" });
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar web" });
  }
};