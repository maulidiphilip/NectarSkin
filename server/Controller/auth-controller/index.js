const User = require("../../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password } = req.body;

    if (!userName || !userEmail || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User name or user email already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      userEmail,
      password: hashPassword,
      role: "user", // Default role set here
    });
    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);

    const accessToken = jwt.sign(
      { _id: savedUser._id, userName, userEmail, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "120m" }
    );

    return res.status(201).json({
      success: true,
      message: "Mwatha kulembesa mu system yathu",
      data: {
        accessToken,
        user: { _id: savedUser._id, userName, userEmail, role: savedUser.role },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to register user",
        error: error.message,
      });
  }
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const checkUser = await User.findOne({ userEmail });
  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

module.exports = { registerUser, loginUser };
