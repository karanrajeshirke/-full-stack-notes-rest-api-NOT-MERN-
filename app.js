const express=require('express');
const app=express();
const path=require('path');

const ejsMate=require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
var methodOverride=require('method-override');

const UserModel=require('./models/UserModel.js');
const NoteModel=require('./models/NoteModel.js');


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.set(express.static(path.join(__dirname,"public")));


app.engine('ejs',ejsMate);


app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));



app.use(session({
    secret: "karanrajeshirke",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());




const mongoose=require('mongoose');

const MONGO_URL='mongodb://127.0.0.1:27017/NotesApp';

async function main()
{
    await mongoose.connect(MONGO_URL);
}

main().then(()=>
{

    console.log("connected to db..");
})
.catch((err)=>
{
    console.log(err);
})


app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.CurrentUser=req.user;
    // console.log(req.session);
    next();
})

const isLoggedIn=(req,res,next)=>
{
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        req.flash("error","you are not logged in ");
        res.redirect('/login');
    }
}



app.get('/register',(req,res)=>
{
    res.render("register");
})

app.post('/register',async (req,res,next)=>
{
    try 
    {
    let {name,username,email,password}=req.body;

    const data={name,username,email};

    const user=new UserModel(data);

    const RegisterUser=await UserModel.register(user,password);


    req.login(RegisterUser,(err)=>
    {
        if(err)
        {
            next(err)
        }
        else
        {
          req.flash("success","Registeration done successfully");
          res.redirect("/notes");
        }
    })
  
    }
    catch(error)
    {
        req.flash("error",error.message);
        res.redirect('/register');
        next(error);
    }
})




app.get('/login',(req,res,next)=>
{
    res.render("login");
})

app.post('/login',passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true
}), (req,res)=>
{
        req.flash("success","You are logged In!!");
        res.redirect("/notes");
})



app.get('/notes',isLoggedIn,async(req,res,next)=>
{
    try
    {
        let UserId=req.user.id;
        let data=await NoteModel.find({owner:UserId}).populate("owner");
        console.log(data);
        res.render("all",{data});
    }
    catch(err)
    {
        next(err);
    }
})

app.post('/notes',isLoggedIn,async(req,res,next)=>
{
    try {

        let {title,description,Topic}=req.body;
        let UserId=req.user.id;
        const note1=new NoteModel(
            {
                title:title,
                description:description,
                Topic:Topic,
                owner:UserId
            }
        )
        let savednote=await note1.save();
        await UserModel.findByIdAndUpdate(UserId, { $inc: { totalNotes: 1 } });

        // console.log(savednote);
        res.redirect("/notes");


    } catch (error) {

        next(error);
        
    }   
});


app.get('/notes/new',isLoggedIn,(req,res,next)=>
{
    res.render("new");
})

app.get('/notes/:id/edit',isLoggedIn,async(req,res,next)=>
{

    try{
        let {id}=req.params;

    let data=await NoteModel.findById(id);

    res.render("edit",{data});
    }
    catch(err)
    {
        next(err);
    }

})

app.put('/notes/:id/edit',isLoggedIn,async (req,res,next)=>
{
    try
    {
        let {id}=req.params;

        let {title,description,Topic}=req.body;
        let data={title,description,Topic};
    
    
        const savednote=await NoteModel.findByIdAndUpdate(id,data);
    
    
        res.redirect("/notes");
    }
    catch(err)
    {
        next(err);
    }
})

app.get('/notes/:id',isLoggedIn,async(req,res,next)=>
{
   try {

    let {id}=req.params;
    let data=await NoteModel.findById(id);
    res.render("show",{data});
   } 
   catch (error) {
        next(error);
   }

})

app.delete('/notes/:id/delete',isLoggedIn,async(req,res,next)=>
{
    try
    {
        let {id}=req.params;
        let UserId=req.user.id;
        let noteDel=await NoteModel.findByIdAndDelete(id);
       if(noteDel)
       {
            await UserModel.findByIdAndUpdate(UserId, { $inc: {totalNotes: -1 } });
       }
    
    
        
        res.redirect("/notes");
    }
    catch(err)
    {
        next(err);
        
    }

})  


app.get('/logout',(req,res)=>
{
    req.logout((err)=>
    {
        if(err)
        {
            return next(err);
        }

        req.flash("success","you are logged out");
        res.redirect('/login');
    })
})

app.use((err,req,res,next)=>
{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("error",{err});

})
app.listen(8080,()=>
{
    console.log("Server started..");

    
})