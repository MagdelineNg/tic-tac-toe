const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

const auth = async (req, res, next) => {
    try{
        //validate token
        const token = req.body.token.replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.JWT_SECRET
        , (err, user) => {
            if (err){
                return err.message
            } else{
                return user
            }
        })
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user){
            throw new Error()
        } 

        req.token = token
        req.user =  user
        next() 
    }catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth