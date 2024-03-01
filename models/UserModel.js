const mongoose=require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        email:
        {
            type:String,
            required:true
        },
        totalNotes:
        {
            type:Number,
            default:0
        }
    }
)
UserSchema.plugin(passportLocalMongoose);
const UserModel=mongoose.model("User",UserSchema);

module.exports=UserModel;
