import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";
import helmet from "helmet";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

//Utilities
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import commentRoutes from "./routes/comment.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/post.js";
import { verifyToken } from "./middlewares/auth.js";
import { uploadImage } from "./services/firebase.js";
import corsOptions from "./config/corsOptions.js";

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

app.post(
  "/api/auth/register",
  Multer.single("pictureFile"),
  uploadImage,
  register
);
app.post(
  "/api/post",
  verifyToken,
  Multer.single("pictureFile"),
  uploadImage,
  createPost
);

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((error) => {
    console.log(error);
  });
