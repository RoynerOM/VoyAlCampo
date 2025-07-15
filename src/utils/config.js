import dotenv from "dotenv";

dotenv.config()// Cargar las variables del archivo .env

const port = process.env.PORT;
const isDev = process.env.ENV === "dev";

export default {port,isDev}