const db = require("../models");

class FolderController {
  async create(req, res, next) {
    try {
      const folder = await db.Folder.create({ title: req.body.title });

      const foundUser = await db.User.findById(req.params.user_id);
      foundUser.folders.push(folder._id);

      folder.owner = req.params.user_id;

      await foundUser.save();
      await folder.save();

      const foundFolder = await db.Folder.findById(folder._id).populate("User");

      return res.status(200).json(foundFolder);
    } catch (err) {
      return next(err);
    }
  }
  async showAll(req, res, next) {
    try {
      const foundUser = await db.User.findById(req.params.user_id).populate(
        "folders"
      );
      const { folders } = foundUser;
      return res.status(200).json(folders);
    } catch (err) {
      return next(err);
    }
  }
  async showOne(req, res, next) {
    try {
      const foundFolder = await db.Folder.findById(
        req.params.folder_id
      ).populate("files");
      return res.status(200).json(foundFolder);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new FolderController();
