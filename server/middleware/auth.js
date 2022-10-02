const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

const auth = async (req, res, next) => {
    console.log("auth req: ", req.body.token)
    // console.log("replace tokemn: ",  )
    try{
        //validate token
        const token = req.body.token.replace('Bearer ', '')

        const decoded = jwt.verify(token, "ilovereact", (err, user) => {
            if (err){
                // console.log("decoded E3RROR: ", err)
                return err.message
            } else{
                return user
            }
        })
        console.log("AUTH USER ID: ", decoded._id)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user){
            throw new Error()
        } 

        req.token = token
        req.user =  user
        console.log("AUTH MIDDLEWARE REQ: ", req.token, req.user)
        next() 
    }catch(e){
        console.log("auth failed: ", e.message)
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth