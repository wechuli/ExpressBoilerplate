const User = require("../models/User.Model");
const env = require("dotenv").load(); //Use the .env file to load the variables
const JWT = require("jsonwebtoken");
const randomstring = require("randomstring");
const mailer = require("../configuration/mailer");

signToken = user => {
  return (token = JWT.sign(
    {
      iss: "blogu",
      sub: user._id,
      iat: new Date().getTime(), //current time
      exp: new Date().setDate(new Date().getDate() + 1) //current date + 1 day ahead
    },
    process.env.JWT_SECRET
  ));
};

module.exports = {
  //get all users whose profiles are listed as public or restricted
  getAllUsers: async (req, res) => {
    const users = await User.find({}, "firstName blogs blogger_since bio");

    res.status(200).json({ message: "find all users returned", users });
  },
  signIn: async (req, res) => {
    console.log(req.user);
    //User is already authenticated, send back json token
    const token = signToken(req.user);
    res.status(200).json({ message: "User successfully authenticated", token });
  },

  //create a new local user, and send back jwt token
  createNewUser: async (req, res) => {
    try {
      // console.log(req.body);
      // console.log(req.value.body);
      // if (User.findOne({ email: req.body.email }) !== null) {
      //   return res.status(500).json({ error: "The User already exists" });
      // }

      const checkUser = await User.findOne({
        email: req.value.body.email
      });

      if (checkUser) {
        return res.status(500).json({ error: "The User already exists" });
      }

      const secret_token = randomstring.generate(64);
      const userReq = {
        firstName: req.value.body.firstName,
        email: req.value.body.email,
        "local.password": req.value.body.password,
        blogger_since: Date.now(),
        method: "local",
        is_admin: false,
        secret_token,
        active: false
      };

      const newUser = new User(userReq);

      await newUser.save();

      //we will not send a token just yet until the user verifies the email address

      // Compose the email
      const html = `Hi there, thank you for signing up for the blogu application where your ideas come to life     
     <br/><br/>
     Please verify your email by clicking the link http://localhost:5000/users/verify/${secret_token}
     You did it dude.
     `;
      //send the email
      await mailer.sendEmail(
        "blogu@wechulipaul.com",
        req.value.body.email,
        "Please verify your email",
        html
      );

      res.status(201).json({
        message:
          "New User Created, check your email address to verify you account"
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //login, or create a new facebook user and return jwt token
  facebookAuth: async (req, res) => {
    //Remember, we have the user in the request object, we'll check first if we have seen this user before using the email address(ideally, shouldn't we ccheck using the facebook id)
    const isExistingUser = await User.findOne({ email: req.user.email });
    if (!isExistingUser) {
      //create the user
      const newUser = new User(req.user);
      newUser.is_admin = false;
      newUser.blogger_since = Date.now();

      await newUser.save();
      //generate a token for the new user and send back
      const token = signToken(newUser);
      res.status(200).json({ token });
    }
    //else if we have this user in the database, we can just send back a token without saving anything, and we would have a valid object returned in the 'isExisting user variable'
    //A problem here- what if the user already signed up with a local account and is now trying to sign up through google

    if (isExistingUser.method === "local") {
      return res.status(500).json({
        error: "User already exists, please sign up using email and password"
      });
    }
    if (isExistingUser.method === "google") {
      return res.status(500).json({
        error: "User already exists, please sign up using your google account"
      });
    }
    const token = signToken(isExistingUser);
    res.json({ token });
  },

  //login, or create a new google user and return jwt token
  googleAuth: async (req, res) => {
    //Remember, we have the user in the request object, we'll check first if we have seen this user before using the email address(ideally, shouldn't we ccheck using the google id)
    const isExistingUser = await User.findOne({ email: req.user.email });
    if (!isExistingUser) {
      //create the user
      const newUser = new User(req.user);
      newUser.is_admin = false;
      newUser.blogger_since = Date.now();

      await newUser.save();
      //generate a token for the new user and send back
      const token = signToken(newUser);
      res.status(200).json({ token });
    }
    //else if we have this user in the database, we can just send back a token without saving anything, and we would have a valid object returned in the 'isExisting user variable'
    //A problem here- what if the user already signed up with a local account and is now trying to sign up through google
    if (isExistingUser.method === "local") {
      return res.status(500).json({
        error: "User already exists, please sign up using email and password"
      });
    }
    if (isExistingUser.method === "facebook") {
      return res.status(500).json({
        error: "User already exists, please sign in using you Facebook account"
      });
    }
    const token = signToken(isExistingUser);
    res.json({ token });
  },
  verifyEmail: async (req, res) => {
    const { token } = req.params;
    console.log(token);
    console.log(req.params);
    try {
      const user = await User.findOne({ secret_token: token }); //Use findOne not find, two different things found out the hard way
      if (!user) {
        return res.status(401).json({ error: "Access token denied" });
      }
      user.active = true;
      user.secret_token = "";
      await user.save();
      res
        .status(200)
        .json({ message: "Email successfully verified, you may login" });
    } catch (error) {
      res.status(401).json({ error });
    }
  },

  //get all profiles listed as public
  getPublicProfiles: async (req, res) => {
    res.json({ message: "All public profiles" });
  },

  //recreate a user - PUT
  reCreateUser: async (req, res) => {
    res.json({ message: "You have reached the path to recreate the user" });
  },

  //update a user - PATCH
  updateUser: async (req, res) => {
    res.json({ message: "You have reached the path to update the user" });
  }
};
