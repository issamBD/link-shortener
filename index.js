import express from "express";
import { createRequire } from "module";
import cors from "cors";
import mongoose from "mongoose";
import createRoutes from "./createRoutes.js";
import getRoutes from "./getRoutes.js";

const require = createRequire(import.meta.url);
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", getRoutes);
app.use("/shorten", createRoutes);

const CONNECTION_URL = process.env.db;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`))
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
