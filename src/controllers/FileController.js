const db = require("../models");

class FileController {
  async upload(req, res, next) {
    try {
      const newFile = await db.File.create({
        title: req.file.originalname,
        path: req.file.key
      });
      const foundFolder = await db.Folder.findById(req.params.folder_id);
      newFile.folder = foundFolder._id;
      newFile.owner = foundFolder.owner;
      foundFolder.files.push(newFile._id);
      await newFile.save();
      await foundFolder.save();
      return res.status(200).json(newFile);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new FileController();
