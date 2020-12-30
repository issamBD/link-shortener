import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  longLink: { type: String, required: true },
  shortLink: { type: String, required: true },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Link = mongoose.model("links", linkSchema);

export default Link;
