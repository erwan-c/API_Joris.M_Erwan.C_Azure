import * as yup from "yup";
import { BlobServiceClient } from "@azure/storage-blob";
import "dotenv/config";
import { MongoClient } from "mongodb";

const mongodbUri = process.env.MONGODB_URI;
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net/?${sasToken}`
);
const containerClient = blobServiceClient.getContainerClient(containerName);

const client = new MongoClient(mongodbUri);
client.connect();

async function createMedia(req, res) {
  const param = yup.object().shape({
    titre: yup.string().required(),
    description: yup.string().required(),
  });
  let test = await param.isValid(req.body);

  if (test)
      {
        var { titre, description } = req.body;
      }

  const file = req.files;
  const blobName = req.files["image"].name;
  if (!file) {
    return res.status(400).json({ error: "Veuillez fournir un fichier." });
  }

  const blobClient = containerClient.getBlockBlobClient(
    `${Date.now()}_${blobName}`
  );

  try {
    await blobClient.upload(file["image"].data, file["image"].size, {
      blobHTTPHeaders: {
        blobContentType: file["image"].mimetype,
      },
    });
    res.end(
      JSON.stringify({
        message: `Le fichier ${Date.now()}_${blobName} a été téléchargé avec succès.`,
      })
    );
  } catch (error) {
    console.error("Error:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Erreur serveur " }));
  }
  console.log(blobName, file["image"].mimetype, blobClient.url, req.user.id, titre, description);
  await storeMetadata(
    blobName,
    file["image"].mimetype,
    blobClient.url,
    req.user.id,
    titre,
    description
    
  );
}

async function storeMetadata(fileName, fileType, imageUrl, user, titre, description) {
  const collection = client.db("4DESA").collection("media");
  await collection.insertOne({ fileName, fileType, imageUrl, user, titre, description });
}

export default createMedia;
