const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const usersinfo = mongoose.model('usersinfo');
var fs=require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './imageuploads/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({dest:'imageuploads/'});
//const upload = multer ({storage: storage});

//count users
router.get('/count', function(req,res){
  User.countDocuments({}, function(error,users){
    if(error){
      res.send('some thing wrong');
      next();
    }
    res.json(users);
  });
})

router.get('/user', function(req,res){
  User.find({}, function(error,users){
    if(error){
      res.send('some thing wrong');
      next();
    }
    res.json(users);
  });
})

//signup user
router.post('/signup',async (req,res)=>{
    const {phone,password,username, profileimage, resignationDate} = req.body;
    try{
      const user = new User({phone,password, username, profileimage, resignationDate});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})
    }catch(err){
      return res.status(422).send(err.message)
    }
})

//check phone number exist or not
router.post('/checkphone',async (req,res)=>{
    const {phone} = req.body
    if(!phone){
        return res.status(422).send({error :"must provide phone"})
    }
    const user = await User.findOne({phone})
    if(!user){
        return res.status(422).send({error :"must provide phone"})
    }
    try{
      //await user.comparePassword(password);    
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})
    }catch(err){
        return res.status(422).send({error :"must provide phone or password"})
    }
})

//sign in user
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

//delete user
router.post('/deleteUser/:id', function(req,res){
  var id = req.params.id;
   User.findByIdAndRemove({_id:id}, async(error, foundobject)=>{
    res.send(updateObject);

  });
})
// update user
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
          if(req.body.joiningdate){
            foundobject.joiningdate=req.body.joiningdate;
          }
          if(req.body.skills){
            foundobject.skills=req.body.skills;
          }
          if(req.body.resignationDate){
            foundobject.resignationDate=req.body.resignationDate;
          }
          if(req.body.emaratesIDFront){
            foundobject.emaratesIDFront=req.body.emaratesIDFront;
          }
          if(req.body.emaratesIDBack){
            foundobject.emaratesIDBack=req.body.emaratesIDBack;
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

router.post('/userimage/:id', upload.single('profileimage'), async (req,res)=>{
  console.log(req.file.path);
    var id = req.params.id;
   await  User.findOne({ _id: id}, async (error, foundobject)=>{
      if(error){
        console.log(error);
        res.status(500).send();
      }else {
        if(!foundobject){
          res.status(404).send();
        }else{
          if(req.body.phone){
            foundobject.phone=req.body.phone;
          }
          if(req.body.username){
            foundobject.username= req.body.username;
          }
          if(req.file.path){
            foundobject.profileimage= req.file.path;
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

router.post('/deleteimage/:imgpath', async (req,res)=>{
  var imgpath = req.params.imgpath;
  try{
    //fs.unlinkSync('imageuploads/${req.params.id}');
    fs.unlinkSync('imageuploads/'+imgpath)
    res.status(201).send({message:"Image deleted"});
  }catch(e){
    res.status(400).send({message:"Error...", error:e.toString(), req: req.body});
  }
})

router.post('/getEmaratesIDFront/:id', upload.single('emaratesIDFront'), async (req,res)=>{
    var id = req.params.id;
   await  User.findOne({ _id: id}, async (error, foundobject)=>{
      if(error){
        console.log(error);
        res.status(500).send();
      }else {
        if(!foundobject){
          res.status(404).send();
        }else{
          if(req.file.path){
            foundobject.emaratesIDFront= req.file.path;
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

router.post('/getEmaratesIDBack/:id', upload.single('emaratesIDBack'), async (req,res)=>{
    var id = req.params.id;
   await  User.findOne({ _id: id}, async (error, foundobject)=>{
      if(error){
        console.log(error);
        res.status(500).send();
      }else {
        if(!foundobject){
          res.status(404).send();
        }else{
          if(req.file.path){
            foundobject.emaratesIDBack= req.file.path;
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