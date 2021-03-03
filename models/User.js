const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    phone:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    username:{type: String,required:false},
    profileimage:{type:String,required:false},
    joiningdate:{type: String,required:false},
    skills:{type: Array,required: false},
    resignationDate:{type: String,required: false},
    emaratesIDFront:{type:String,required:false},
    emaratesIDBack:{type:String,required:false},
   // emaratesID:{type: Array, required:false},
})
userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err)
        }
     bcrypt.hash(user.password,salt,(err,hash)=>{
         if(err){
             return next(err)
         }
         user.password = hash;
         next()
     })
    })
})

userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if (!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })
}

mongoose.model('User',userSchema);