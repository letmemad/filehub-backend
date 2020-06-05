const { Storage } = require("@google-cloud/storage");
const gCloud = new Storage({
  keyFilename: process.env.GCS_KEYFILENAME,
  projectId: process.env.GCS_PROJECTID,
});
const bucket = gCloud.bucket("files-hot");

module.exports = (req, res, next) => {
  if (!req.file)
    return res.status(400).json({ error: "Please select a file." });
  const file = bucket.file(`${Date.now()}${req.file.originalname}`);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
    public: true,
    resumable: true,
  });

  stream.on("error", (err) => {
    req.file.gCloudError = err;
    return res.status(500).json({ err });
  });

  stream.on("finish", () => {
    req.file.gCloudFile = file.metadata;
    return next();
  });

  stream.end(req.file.buffer);
};
