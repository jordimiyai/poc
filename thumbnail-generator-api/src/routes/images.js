const { Router } = require("express");
const multer  = require('multer');
const { addImage, getImage } = require("./controllers/images");
const router = Router();
const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy })


router.get("/:key", getImage);

router.post("/", upload.single('image'),addImage);

module.exports = router;