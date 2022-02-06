const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = {
  register: async (req, res, next) => {
    try {
      // Get User Info
      const { firstName, lastName, username, email, password } = req.body;

      // check wether email is duplicated
      const query = await User.findOne({ email });
      if (query)
        return res.status(400).json({
          error: "User already registered",
        });

      // hash password
      const hash_password = await bcrypt.hash(password, 10);

      // create new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username,
      });
      // save new user
      //   await newUser.save((error, user) => {
      //     if (error) {
      //       return res.status(400).json();
      //     }

      //     if (user) {
      //       const token = generateJwtToken(user._id, user.role);
      //       const { _id, firstName, lastName, email, role, fullName } = user;
      //       return res.status(201).json({
      //         token,
      //         user: { _id, firstName, lastName, email, role, fullName },
      //       });
      //     }
      //   });

      // save user
      await newUser.save();

      // return new blogger
      return res
        .status(201)
        .json({ user: newUser, message: "Create new user successfully" });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      // get info
      const email = req.body.email;
      const password = req.body.password;

      // check if email and password difference
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email or Password Must Not Be Empty" });
      }

      // check email is existing
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send("Wrong Username or Password");
      }
      if (user) {
        //   compare password
        const isPassword = await user.authenticate(req.body.password);
        // check role
        if (isPassword && user.role === "user") {
          const accessToken = generateJwtToken(user._id, user.role);
          const { _id, firstName, lastName, email, role, fullName } = user;

          //   if check success
          res.status(200).json({
            msg: "Login Success.",
            accessToken,
            user: { _id, firstName, lastName, email, role, fullName },
          });
        } else {
          return res.status(400).json({
            message: "Login failed",
          });
        }
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    } catch (err) {
      next(err);
    }
  },
  //  get info on all of the user
  getAll: async (req, res) => {
    try {
      let users = await Blogger.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //    get one info of the user
  getOne: async (req, res) => {
    try {
      let user = await Blogger.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //   update one
  updateOne: async (req, res) => {
    try {
      await Blogger.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).json("User updated successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //  delete one
  deleteOne: async (req, res) => {
    try {
      let user = await Blogger.findById(req.params.id);
      await user.delete();
      res.status(200).json("User deleted successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
