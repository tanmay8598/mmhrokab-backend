const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

const s3 = new S3Client(config);

const upload = multer({
  storage: multerS3({
    s3,

    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `${fileName}${path.extname(file.originalname)}`);
    },
  }),
});

const uploadStorage = multer({ storage: storage });
router.post(
  "/uploadSingleImage",
  uploadStorage.single("image"),
  async (req, res) => {
    const file = req.file;

    const img = req.file.originalname;

    const vision = require("@google-cloud/vision");
    const client = new vision.ImageAnnotatorClient({
      keyFilename: "./mmhrokab-bd26a14478d1.json",
    });
    const parse = require("mrz").parse;

    //Google Cloud Vision Text Annotator (OCR)
    let sample1 = `./uploads/${img}`;
    try {
      //Extracting the mrz and preparing it for decoding
      const [result] = await client.textDetection(sample1);
      const texts = result.textAnnotations;
      let mainResult = texts[0].description;
      let mrzStartPosition = mainResult.indexOf("P<");
      let mrzText = mainResult.slice(mrzStartPosition);
      let textss = mrzText.replace(/\s/g, "");
      let line1 = textss.substring(0, 44);
      let line2 = textss.substring(44, 88);
      let mrzToDecode = `${line1}\n${line2}`;

      let passportDetails = parse(mrzToDecode);

      res.status(201).send(passportDetails);
    } catch (error) {
      res.status(404).json(error);
    }
  }
);
router.post("/uploadSingleImg", upload.single("image"), async (req, res) => {
  const result = req.file;

  //define what to do if result is empty
  res.send(`${result.location}`);
});

module.exports = router;
