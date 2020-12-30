import Link from "./model.js";
import RandExp from "randexp";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const shortenLink = async (req, res) => {
  try {
    let longLink = req.body.longLink;

    if (!longLink) {
      return res.status(400).json({ error: "Please enter a link" });
    }

    // check if link is valid
    if (longLink.length > 253) {
      return res.status(400).json({ error: "Please enter valid link" });
    }
    if (!longLink.includes(".")) {
      return res.status(400).json({ error: "Please enter valid link" });
    }

    //make all submitted links have the samle format http://facebook.com
    if (!longLink.includes("http")) {
      longLink = `http://${longLink}`;
    }
    let index = longLink.indexOf("www.");
    if (index !== -1) {
      longLink =
        longLink.slice(0, index) + longLink.slice(index + "www.".length);
    }

    //check if link has been shortened before
    const existingLongLink = await Link.findOne({ longLink: longLink });
    if (existingLongLink) {
      return res.send({ shortLink: existingLongLink.shortLink });
    }

    //generate a valid short link
    let pathIsValid = false;
    var path, shortLink;

    while (!pathIsValid) {
      path = new RandExp(/^[A-Za-z0-9_.\-~]{6}$/).gen();
      shortLink = `shortly.ninja/${path}`;
      const exisitingShortLink = await Link.findOne({ shortLink: shortLink });
      if (!exisitingShortLink) pathIsValid = true;
    }

    //add the new link to the db and return it
    const newLink = await new Link({
      longLink,
      shortLink,
    });
    const savedLink = await newLink.save();

    res.json({
      shortLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getIndex = (req, res) => {
  res.sendFile("./views/index.html", { root: __dirname });
};

export const getLongLink = async (req, res) => {
  try {
    const path = req.params.path;

    //construct short link
    const shortLink = `shortly.ninja/${path}`;

    //check if link exists
    const query = { shortLink: shortLink };
    const link = await Link.findOne(query);
    if (!link) {
      return res.sendFile("./views/404.html", { root: __dirname });
    }

    //inrement the number of visits
    const updatedLink = await Link.findOneAndUpdate(
      query,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    //redirect to the original link
    res.redirect(updatedLink.longLink);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClicks = async (req, res) => {
  try {
    const shortLink = req.body.shortLink;
    const link = await Link.findOne({ shortLink: shortLink });

    //check if link exists
    if (!link) {
      return res.status(400).json({ error: "Please enter valid link" });
    }

    res.json({
      clicks: link.clicks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
