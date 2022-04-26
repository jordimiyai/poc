const sharp = require("sharp");
// const fs = require("fs");

async function changeSize(image, width, height) {
  const updatedImage = await sharp(image.buffer)
    .resize(width, height, {
      fit: "fill",
    })
    .toBuffer();
  return updatedImage;
}

// async function saveToDisk(image, name) {
//   fs.writeFileSync(`thumbnails/${name}`, image);
// }

async function newThumbnail(image, width, height, name) {
  const thumbnail = await changeSize(image, width, height);
  const response = await uploadImage(thumbnail, name);
  return response;
}

const createThumbnails = async function (image) {
  try {
    const RESIZE_VALUES = ["400x300", "160x120", "120x120"];
    //removes spaces and splits to get extension
    const completeName = image.originalname.replace(/\s+/g, "").split(".");
    const extension = completeName.pop();
    const thumbnails = RESIZE_VALUES.map(async (size) => {
      //creates a new string with the original, the size and the original extension.
      const name = completeName.join("_") + "_" + size + "." + extension;
      const [width, height] = size.split("x");
      const thumbnail = await newThumbnail(
        image,
        parseInt(width),
        parseInt(height),
        name
      );
      return { size: size, key: thumbnail.Key };
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

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const S3 = require("aws-sdk/clients/s3");
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function uploadImage(image, name) {
  const uploadParams = {
    Bucket: "jordimiyai-thumbnail",
    Body: image,
    Key: name,
  };

  return s3.upload(uploadParams).promise();
}

function fetchThumbnail(imageKey) {
  const downloadParams = {
    Bucket: bucketName,
    Key: imageKey,
  };

  return s3.getObject(downloadParams).createReadStream();
}
module.exports = {
  createThumbnails,
  validateObject,
  uploadImage,
  fetchThumbnail,
};
