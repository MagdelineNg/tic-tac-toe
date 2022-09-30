const bcrypt = require("bcrypt");
const User = require("../model/userModel");

module.exports.register = async (req, res, next) => {
  try {
    const { user, password } = req.body;

    const usernameCheck = await User.findOne({ user });
    if (usernameCheck) {
      return res.json({ msg: "Username is taken", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await User.create({
      user,
      password: hashedPassword,
    });
    return res.json({ status: true, newUser });
  } catch (e) {
    console.log("register controller");
    console.log(e);
    next(e);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { user, password } = req.body;
    console.log("login controller", req.body)
    const existingUser = await User.findOne({ user });

    if (!existingUser){
        return res.json({ msg: "Incorrect username or password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid){
        return res.json({ msg: "Incorrect username or password", status: false });
    }

    return res.json({ status: true, existingUser });
  } catch (e) {
    console.log("login controller");
    console.log(e);
    next(e);
  }
};

module.exports.checkRival = async (req, res, next) => {
    try{
        user = req.params.username
        const isExist = await User.findOne({ user })  //findOne returns null, find doenst
        if (!isExist){
            return res.json({status: false})
        }
        return res.json( {status: true})
    }catch(e){
        console.log("get rival e: ", e)
        next(e)
    }
}
