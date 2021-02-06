const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    makaninumber:{
        type:String
    },
    address:{
        type:String
    },
    email:{
        type:String
    },
    trnnumber:{
        type:String
    }
})

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
})

mongoose.model('usersinfo',userSchema);