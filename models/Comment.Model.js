const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  blog: {
    type: Schema.Types.ObjectId,
    ref: "blog",
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    required: true
  },
  date_edited: Date
});

module.exports = mongoose.model("comment", commentSchema);
