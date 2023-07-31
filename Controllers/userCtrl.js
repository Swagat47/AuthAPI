const User = require("../Models/userModel");

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

    if(!universityID || !password){
        return res.status(400).json({msg: "Not all fields have been entered."});
    }
    const user = await User.findOne({ universityID, password });
    if(!user){
        return res.status(400).json({msg: "No account with this university ID has been registered."});
    }
    else{
        return res.json({
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                universityID: user.universityID,
                role: user.role
            }
        });
    }
};



