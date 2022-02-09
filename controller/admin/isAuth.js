const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

module.exports = {
    signUp: async (req, res) => {
        try {
            // get admin info
            const { firstName, lastName, email, password, username } = req.body;

            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    msg: "Admin already registered",
                });
            }

            const hash_password = await bcrypt.hash(password, 10);

            const newAdmin = new User({
                firstName,
                lastName,
                email,
                password: hash_password,
                username: shortid.generate(),
                role: "admin",
            });

            newAdmin.save();

            return res.status(200).json({
                msg: "Admin created Successfully..!",
            });
        } catch (error) {
            console.error(error);
        }
    },
    signIn: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await User.findOne({ email });

            if (!user) {
                res.status(400).json({ msg: "Wrong" });
            }

            if (user) {
                const isPassword = await user.authenticate(password);

                if (isPassword && user.role == "admin") {
                    const accessToken = jwt.sign(
                        {
                            _id: user._id,
                            role: user.role,
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1d",
                        },
                    );
                    const { _id, firstName, lastName, email, role, fullName } = user;
                    res.cookie("token", accessToken, {
                        expiresIn: "1d",
                    });
                    res.status(200).json({
                        accessToken,
                        user: {
                            _id,
                            firstName,
                            lastName,
                            email,
                            role,
                            fullName,
                        },
                    });
                } else {
                    return res.status(400).json({
                        message: "Invalid Password",
                    });
                }
            } else {
                return res.status(400).json({ message: "Something went wrong" });
            }
        } catch (error) {
            console.error(error);
        }
    },
    logOut: (req, res) => {
        res.clearCookie("token");
        res.status(200).json({
            message: "SignOut successfully...!",
        });
    },
};
