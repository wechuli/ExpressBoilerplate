const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  local: {
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    }
  },
  bio: String,
  blogger_since: Date,
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: "blog"
    }
  ],
  visibility: {
    type: String,
    enum: ["public", "restricted", "private"]
  },
  dob: Date,
  is_admin: {
    type: Boolean,
    required: true
  },
  secret_token: String,
  active: Boolean
});

userSchema.pre("save", async function(next) {
  try {
    if (this.method !== "local") {
      next();
    }
    if (this.isNew) {
      //Genrate a salt
      const salt = await bcrypt.genSalt(10);
      //Generate password hash  salt+password
      const passwordhash = await bcrypt.hash(this.local.password, salt); //hash the password

      //reasign the hashed password as the new password
      this.local.password = passwordhash;
      next();
    }
    next();
  } catch (error) {
    next(error);
  }
});

//To validate the password, we define a method

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error();
  }
};

module.exports = mongoose.model("user", userSchema);
