const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const usersinfo = mongoose.model('usersinfo');

router.post('/signup',async (req,res)=>{
    const {phone,password,username, profileimage} = req.body;
    try{
      const user = new User({phone,password, username, profileimage});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})
    }catch(err){
      return res.status(422).send(err.message)
    }
})


router.post('/signin',async (req,res)=>{
    const {phone,password} = req.body
    if(!phone || !password){
        return res.status(422).send({error :"must provide phone or password"})
    }
    const user = await User.findOne({phone})
    if(!user){
        return res.status(422).send({error :"must provide phone or password"})
    }
    try{
      await user.comparePassword(password);    
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})
    }catch(err){
        return res.status(422).send({error :"must provide phone or password"})
    }
})

router.post('/signup/:id',async (req,res)=>{
  var id = req.params.id;
   await  User.findOne({ _id: id}, async (error, foundobject)=>{
      if(error){
        console.log(error);
        res.status(500).send();
      }else {
        if(!foundobject){
          res.status(404).send();
        }else{
          if(req.body.username){
            foundobject.username= req.body.username;
          }
          if(req.body.profileimage){
            foundobject.profileimage= req.body.profileimage;
          }
          if(req.body.password){
            foundobject.password=req.body.password;
          }
          foundobject.save(function(error, updateObject){
            if(error){
              console.log(error);
              res.status(500).send();
            } else{
              res.send(updateObject);
            }
          });
        }
      }
   });
})

module.exports = router
