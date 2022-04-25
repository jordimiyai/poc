const sharp = require("sharp");
const fs = require("fs");

async function changeSize(image, width, height) {
  const updatedImage = await sharp(image.buffer)
    .resize(width, height, {
      fit: "fill",
    })
    .toBuffer();
  return updatedImage;
}

async function saveToDisk(image, name) {
  fs.writeFileSync(`thumbnails/${name}`, image);
}

async function newThumbnail(image, width, height, name) {
  //ver de problemas con la extension

  const thumbnail = await changeSize(image, width, height);
  saveToDisk(thumbnail, name);
  return thumbnail;
}

const createThumbnails = async function (image) {
  try {
    const RESIZE_VALUES = ["400x300", "160x120", "120x120"];
    const completeName = image.originalname.split(".");
    const extension = completeName.pop();
    const thumbnails = RESIZE_VALUES.map(async (size, i) => {
      const name = completeName.join("_") + "_" + size + "." + extension;
      const [width, height] = size.split("x");

      const thumbnail = await newThumbnail(
        image,
        parseInt(width),
        parseInt(height),
        name.toLocaleLowerCase()
      );

      return { img: thumbnail.toString("base64"), name: name };
    });

    return Promise.all(thumbnails);
  } catch (error) {
    console.log(error);
  }
};

function validateObject(image) {
  const imageType = /^.*\.(jpg|JPG|png|PNG|jpeg|JPEG)$/;
  const maxSize = 2000000;
  if (!image.originalname.match(imageType)) return "Invalid Format";
  if (image.size > maxSize) return "Invalid File Size";
  return null;
}

module.exports = {
  createThumbnails,
  validateObject,
};
