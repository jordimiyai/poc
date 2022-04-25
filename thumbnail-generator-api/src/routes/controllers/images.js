const { createThumbnails, validateObject } = require("../services/images");

const addImage = async function (req, res) {
  try {
    const image = req.file;
    if (validateObject(image)) {
      res.status(400);
    }
    const response = await createThumbnails(image);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addImage,
};
