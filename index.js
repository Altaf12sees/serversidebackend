const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const PORT = 3000
const {mogoUrl} = require('./keys')


require('./models/User');
require('./models/usersinfo');

const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')
app.use(bodyParser.json())
app.use(authRoutes)
app.use('/imageuploads',express.static('imageuploads'));
//app.use('/models/public/notification', require('./models/public/notification'));
mongoose.connect(mogoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})

app.get('/',requireToken,(req,res)=>{
    res.send({
        _id:req.user._id, 
        phone:req.user.phone, 
        username:req.user.username, 
        profileimage:req.user.profileimage,
        joiningdate:req.user.joiningdate,
        skills:req.user.skills,
        resignationDate:req.user.resignationDate,
        emaratesIDFront:req.user.emaratesIDFront,
        emaratesIDBack:req.user.emaratesIDBack,
        })
})


app.listen(PORT,()=>{
    console.log("server running "+PORT)
})