// const mongoose=require('mongoose');
// const fakeData=require('./data.js');
// const NoteModel=require('../models/NoteModel.js');
// const MONGO_URL='mongodb://127.0.0.1:27017/NotesApp';
// async function main()
// {
//     await mongoose.connect(MONGO_URL);
// }

// main().then(()=>
// {

//     console.log("connected to db..");
// })




// const addData=async ()=>
// {
//     await NoteModel.deleteMany({});
//     let data=await NoteModel.insertMany(fakeData);
//     console.log(data);
// }

// addData();