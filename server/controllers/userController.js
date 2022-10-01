const bcrypt = require("bcrypt");
const User = require("../model/userModel");

module.exports.register = async (req, res, next) => {
  try {
    const { user, password, socketId } = req.body;

    const usernameCheck = await User.findOne({ user });
    if (usernameCheck) {
      return res.json({ msg: "Username is taken", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await User.create({
      user,
      password: hashedPassword,
      socketId,
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

    //create map of user: socket to get socketid later on for room creation

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

module.exports.getPastGames = async (req, res, mext) => {
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

// module.exports.createGameRoom = async(req, res, next)=> {
//     const {roomId, currentUser} = req.body
//     try{
//         console.log("CURRENT USER PASSED SUC:", currentUser)
//         let doc = await User.findOneAndUpdate({user: currentUser.user}, {socketId: roomId}, {new: true})
//         console.log(doc)
//     }catch(e){
//         console.log('saving game room id failed: ', e)
//         next(e)
//     }
// }