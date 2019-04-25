const db = require("../models");
const fs = require("fs");
const path = require("path");
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
      req.io.sockets.in(foundUser._id).emit("folder", folder);
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
  // WIP
  async deleteOne(req, res, next) {
    try {
      const foundFolder = await db.Folder.findById(req.params.folder_id);
      for (let i = 0; i < foundFolder.files.length; i++) {
        const foundFile = await db.File.findById(foundFolder.files[i]);
        fs.unlink(
          path.resolve(__dirname, "..", "..", "tmp", foundFile["path"]),
          err => next(err)
        );
        foundFolder.files.remove(foundFile._id);
      }
      const foundUser = await db.User.findById(req.params.user_id);
      foundUser.folders.remove(foundFolder._id);
      await foundUser.save();
      await foundFolder.remove();
      return res.status(200).json(foundFolder);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new FolderController();
