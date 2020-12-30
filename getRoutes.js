import express from "express";
import { getIndex, getLongLink, getClicks } from "./controllers.js";

const app = express();
const router = express.Router();

router.get("/", getIndex);
router.get("/:path", getLongLink);
router.post("/getClicks", getClicks);

export default router;
