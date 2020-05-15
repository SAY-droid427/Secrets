require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const app=express();
const saltRounds=10;

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


const User=mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        const newUser=new User({
            email:req.body.username,
            password:hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }
            else{
                res.render("secrets");
            }
        });
    });
    });
  

app.post("/login",function(req,res){
    
        const userInput=req.body.username;
        const password=md5(req.body.password);
        User.findOne({email:userInput},function(err,found){
            if(err){
                console.log(err);
            }
            else{
                if(found){
                    bcrypt.compare(password,found.password,function(err,result){
                        if(result==true)
                        {
                            res.render("secrets");
                        }


                    });
                    
                }
            }
        })
   
    });


app.listen(3000,()=>{console.log("Server started at port 3000");})
