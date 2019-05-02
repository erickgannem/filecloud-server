const mongoose = require("mongoose");

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
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

fileSchema.virtual("url").get(function() {
  const { URL, PORT } = process.env;
  switch (process.env.ENV) {
    case "development":
      return `${URL}${PORT}/api/users/${this.owner}/folders/${this.folder}/${encodeURIComponent(this.path)}`;
    case "production":
      return `${URL}/api/users/${this.owner}/folders/${this.folder}/${encodeURIComponent(this.path)}`;
    default:
      return;
  }
});
module.exports = new mongoose.model("File", fileSchema);
