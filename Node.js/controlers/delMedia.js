import Media from "../models/media.js";

const delMedia = async (req, res) => {
  try {
    const result = await Media.findById(req.params.id);

    if (req.user.id == result.user) {
      const deleted = await Media.findByIdAndDelete(req.params.id);

      if (!deleted) {
        res.sendStatus(404);
        return;
      }
      res.status(200).send(deleted);
    } else {
      res.status(400).send("Vous n'avez pas les droits de supprimer ce média");
    }
  } catch (error) {
    console.log(req.params.id);
    if (error.kind && error.kind === "ObjectId") {
      res.sendStatus(404).send("Média non trouvé");
      return;
    }
    res.sendStatus(500).send("Erreur serveur");
    console.log(error);
  }
};
export default delMedia;
