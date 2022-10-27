import mongoose from "mongoose";
import { env } from "./config.js";

mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("Connection to database established!"))
  .catch((err) => console.log("[ERROR] Connection failed!", err.message));
