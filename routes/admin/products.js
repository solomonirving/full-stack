const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", (req, res) => {});

//Allow admin-users to create new products
router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  [requireTitle, requirePrice],
  upload.single("image"),
    async (req, res) => {
    const errors = validationResult(req);
    //convert image to string format and save to variable 
    const image = req.file.buffer.toString('base64');
    //get access to the title and price from req.body 
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.send("submitted");
  }
);
module.exports = router;
