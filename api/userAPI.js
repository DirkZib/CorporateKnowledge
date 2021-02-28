const express = require("express")
const User = require('../backend/userSchema')
const router = express.Router()

const data = {
    userName: "TestAAA"
}

const newUser = new User(data)

router.post('/test', async(req,res)=>{
  const data = req.body
  const newUser = new User(data)    
  newUser.save((error) =>{
    if (error) {
        console.log('error: ' + error)
    }else{
        console.log('Everything works fine')
    }
    })
    // const{userName, mail} = req.body
    // let user = {}
    // user.userName = userName
    // user.mail = mail
    // let userModel = new User(user)
    // await userModel.save()
    // res.json(userModel)
})

module.exports = router