import multer from "multer";

import fs from "fs";
const dir = "./Public/temp";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📁 Destination called for file:", file.originalname);
    cb(null, "./Public/temp");
  },
  filename: function (req, file, cb) {
    console.log("📁 Filename called for file:", file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
