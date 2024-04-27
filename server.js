require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const planRoutes = require("./routes/planRoutes");
const subsRoutes = require("./routes/subsRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const miscRoutes = require("./routes/miscRoutes");
const companyRoutes = require("./routes/companyRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { generatePdf } = require("./controller/pdfController");
const app = express();
const source = process.env.MONGO_URI;
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/subs", subsRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/generatepdf", pdfRoutes);

mongoose
  .connect(source)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Successfully served on port: ${PORT}.`);
});
