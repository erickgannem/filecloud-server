const mongoose = require("mongoose");
const db = require("./index");

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder"
    }
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

fileSchema.virtual("url").get(function() {
  const { URL } = process.env;
  return `${URL}/api/users/${user._id}/folders/${folder._id}/${encodeURIComponent(this.path)}`;
});
module.exports = new mongoose.model("File", fileSchema);
