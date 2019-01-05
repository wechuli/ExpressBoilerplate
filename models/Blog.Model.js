const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  visibility: {
    type: String,
    enum: ["public", "private", "restricted", "draft"]
  
  },
  published_date: Date,
  edit_date: Date,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comment"
    }
  ],
  language: String,
  keyphrases: [String],
  sentiment: Number
});

module.exports = mongoose.model("blog", blogSchema);
