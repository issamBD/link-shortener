import express from "express";
import { shortenLink } from "./controllers.js";

const app = express();
const router = express.Router();

router.post("/", shortenLink);

export default router;
