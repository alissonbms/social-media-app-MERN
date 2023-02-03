import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = [process.env.ALLOWED_ORIGIN];

export default allowedOrigins;
