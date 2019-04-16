const mongoose = require("mongoose");
const db = require("./index");

const folderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Folder", folderSchema);
