const asyncHandler = require("express-async-handler");
const pdf = require("html-pdf");
const template = require("./template");
const axios = require("axios");

const aws = require("aws-sdk");
const fs = require("fs");
const Pdf = require("../models/pdfModel");
// const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const generatePdf = asyncHandler(async (req, res) => {
  const { company, userData, driver, locto, locfrom, plateno } = req.body;

  const imgurl = company.header;

  const imgurlF = company.footer;

  var options = {
    format: "A4",
    header: {
      height: "80mm",
      contents: `<header style="margin: auto; width: 90%; height:70mm;">
      <img style="float: left; width: 95%;"src=${imgurl}  />
    </header>`,
    },
    footer: {
      height: "28mm",
      contents: `<footer style="margin: auto; width: 90%">
    <img style="float: left; width: 95%" src=${imgurlF}  />
  </footer>`,
    },
  };

  pdf
    .create(
      template({ userData, driver, locto, locfrom, plateno, imgurl, imgurlF }),
      options
    )
    .toFile(`${__dirname}/${driver._id}.pdf`, (err) => {
      const fileContent = fs.readFileSync(`${__dirname}/${driver._id}.pdf`);
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${fileName}.pdf`,
        Body: fileContent,
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          console.error("Error uploading file:", err);
        } else {
          const pdf = await Pdf.create({
            company: company._id,
            pdf: data.Location,
            user: driver._id,
          });
          fs.unlinkSync(`${__dirname}/${driver._id}.pdf`);
          res.json(pdf);
        }
      });
    });
});

const getPdf = asyncHandler(async (req, res) => {
  const pdf = await Pdf.find({}).populate("user company");
  res.json(pdf);
});

module.exports = {
  generatePdf,
  getPdf,
};
