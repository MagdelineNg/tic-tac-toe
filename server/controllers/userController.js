const bcrypt = require("bcrypt");
const User = require("../model/userModel");

module.exports.register = async (req, res) => {
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

    const token = await newUser.generateAuthToken()
    res.cookie('auth_token', token)
    console.log("register controller: ",  res.cookie, res.cookie['auth_token'])
    return res.json({ status: true, newUser, token });

  } catch (e) {
    res.status(400).send(e)
  }
};

module.exports.login = async (req, res) => {
  try {
    const { user, password } = req.body;
    const existingUser = await User.findOne({ user });

    if (!existingUser){
        return res.json({ msg: "Incorrect username or password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid){
        return res.json({ msg: "Incorrect username or password", status: false });
    }

    const token = await existingUser.generateAuthToken()
    // res.cookie('auth_token', token)

    // console.log("login token: ", localStorage.getItem('auth_token'))

    // console.log("login COOKIE: ", res.cookie, res.cookie['auth_token'])
    return res.json({ status: true, existingUser, token });
  } catch (e) {
    res.status(400).send()
  }

};

module.exports.logout = async (req, res) => {
  console.log("lougout req: ", req.token)
  console.log("logout user: ", req.user.tokens)
  try{
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token   
    })
    await req.user.save()
    return res.json({status: true})
  }catch(e){
    console.log("ERROR IN LOGOUT: ", e.message)
    res.status(500).send()
  }
}

module.exports.checkRival = async (req, res) => {
    try{
        user = req.params.username
        const isExist = await User.findOne({ user })  //findOne returns null, find doenst
        if (!isExist){
            return res.json({status: false})
        }
        return res.json( {status: true})
    }catch(e){
      console.log(e.message)
    }
}

module.exports.getPastGames = async (req, res) => {
  try{
    user = req.params.username
    console.log("user in getpastgames: ", user)
    const currentUserMatrix = await User.findOne({ user}, 'allMatrix result')
    console.log("GETPASTGAMES currentUserMatrix: ", currentUserMatrix)
    return res.json(currentUserMatrix)
  }catch(e){
    console.log(e.message)
  }
}

