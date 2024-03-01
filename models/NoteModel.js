const mongoose=require('mongoose');
const NoteSchema=new mongoose.Schema(
    {
        title:
        {
            type:String,
            required:true
        },
        description:
        {
            type:String,
            required:true
        },
        CreatedAt:
        {
            type:Date,
            default: Date.now
        },
        Topic:
        {
            type:String,
            required:true
        },
        owner:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    }
)

const NoteModel=mongoose.model("Note",NoteSchema);

module.exports=NoteModel;
