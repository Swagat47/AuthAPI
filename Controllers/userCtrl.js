const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
exports.registerUser = async (req, res) => {
  try {
    const { name, universityID, password, role } = req.body;
    const user = await User.create({
      name,
      universityID,
      password,
      role,
    });
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "error in userCtrl, registerUser",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { universityID, password } = req.body;

  if (!universityID || !password) {
    return res.status(400).json({ msg: "Not all fields have been entered." });
  }
  const user = await User.findOne({ universityID, password });
  const payload = {
    id: user._id,
    name: user.name,
    universityID: user.universityID,
    role: user.role
  };
  if (!user) {
    return res.status(400).json({ msg: "No account with this university ID has been registered." });
  }

  else {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      return res.json({
        token,
      });
    });
  }
};



