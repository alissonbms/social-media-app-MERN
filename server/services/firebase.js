import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: process.env.CREDENTIALS_1,
  project_id: process.env.CREDENTIALS_2,
  private_key_id: process.env.CREDENTIALS_3,
  private_key: process.env.CREDENTIALS_4,
  client_email: process.env.CREDENTIALS_5,
  client_id: process.env.CREDENTIALS_6,
  auth_uri: process.env.CREDENTIALS_7,
  token_uri: process.env.CREDENTIALS_8,
  auth_provider_x509_cert_url: process.env.CREDENTIALS_9,
  client_x509_cert_url: process.env.CREDENTIALS_10,
};

const BUCKET = "social-media-app-mern-8c91e.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

export const uploadImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const pictureType = req.body.pictureType;
  const picture = req.file;

  const pictureName =
    pictureType + Date.now() + "." + picture.originalname.split(".").pop();

  const file = bucket.file(
    pictureType === "profile"
      ? "profilePictures/" + pictureName
      : "postPictures/" + pictureName
  );

  const stream = file.createWriteStream({
    metadata: {
      contentType: picture.mimetype,
    },
  });

  stream.on("error", (error) => {
    console.error(error);
  });

  stream.on("finish", async () => {
    try {
      await file.makePublic();
    } catch (err) {
      console.error("error making file public", err);
    }
  });

  stream.end(picture.buffer);

  req.file.firebaseUrl =
    pictureType === "profile"
      ? `https://storage.googleapis.com/${BUCKET}/profilePictures%2F${pictureName}`
      : `https://storage.googleapis.com/${BUCKET}/postPictures%2F${pictureName}`;

  next();
};
