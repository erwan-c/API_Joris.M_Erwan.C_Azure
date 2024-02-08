import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import login from "./controlers/login.js";
import webtoken from "./middleware/webtoken.js";
import createUser from "./controlers/createUser.js";
import { readMedia } from "./controlers/readMedia.js";
import createMedia from "./controlers/createMedia.js";
import updateMedia from "./controlers/updateMedia.js";
import delMedia from "./controlers/delMedia.js";
import { readUser } from "./controlers/readUser.js";
import delUser from "./controlers/delUser.js";
import updateUser from "./controlers/updateUser.js";
import fileSizeLimiter from "./middleware/fileSizeLimiter.js";
import fileExtLimiter from "./middleware/fileExtLimiter.js";
import "dotenv/config";
import fileUpload from 'express-fileupload';


const app = express();
const mongodbUri = process.env.MONGODB_URI;

mongoose
  .connect(mongodbUri)
  .then(() => console.log("Connection à la base de données OK"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(cookieParser());

app.listen(8080, () => {
  console.log("API en écoute sur le port 3000");
});

app.get("/media/read", readMedia);
app.get("/user/read", readUser)

app.post("/media/create", [webtoken, fileUpload({createParentPath: true}),  fileExtLimiter(['.mkv', '.mp4', '.png', '.jpg']), fileSizeLimiter], createMedia);
app.post("/user/create", createUser);
app.post("/user/authentification", login);

app.patch("/user/update/:id",webtoken, updateUser);
app.patch("/media/update/:id",webtoken, updateMedia);

app.delete("/media/delete/:id",webtoken, delMedia);
app.delete("/user/delete/:id",webtoken,delUser )
export { app };
