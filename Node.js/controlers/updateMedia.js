import Media from "../models/media.js";
const updateMedia = async (req, res) => {
  try {
    const result = await Media.findById(req.params.id);

    if (req.user.id == result.user) {
      const { titre, description } = req.body;

      const modifMedia = await Media.findByIdAndUpdate(req.params.id, {
        titre,
        description,
      });
      console.log(titre);
      res.status(200).send(modifMedia);
    } else {
      res.status(400).send("Vous n'avez pas les droits de modifier ce média");
    }
  } catch (error) {
    if (error.kind && error.kind === "ObjectId") {
      res.sendStatus(404).send("Média non trouvé");
      return;
    }
    res.sendStatus(500).send("Erreur Serveur");
  }
};

export default updateMedia;
