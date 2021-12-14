const express = require("express");
 const main = express();

const mongoose = require("mongoose");
const cookieparser = require('cookie-parser');
const { verify } = require('./libs/jwt');
const fileupload = require("express-fileupload");
mongoose.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false")


const userSchema = new mongoose.Schema({
    name:String,
    address:String,
    pic:String,
    email:String,
    password:String
})

const UserModel = mongoose.model('student',userSchema)

main.use(express.urlencoded({extended:true}))

main.set('view engine','ejs');
main.set("static","./views/");



main.get('/login', (req,res) => {
    res.render('login',{ title:"Login" });
})


main.post('/login', (req,res) => {
    console.log(req.body);
    const { email, password } = req.body;
    //res.json(`${email} ${password}`);
    UserModel.findOne({email: email})
    .then((result) => {
        try{
            const pass = dcrypt.compare(req.body.password,result.password);
            console.log(pass);
            console.log(result.password);
            if(result){
                const token = jwt.sign({email: req.body.email},key,{algorithm:"HS256",expiresIn:expireSec});
                res.cookie("token",token,{maxAge:expireSec*1000});
                res.json(result);
            }
            else{
                res.json({message:"Invalid email/password"});
            }
        }
        catch(error){
            res.send(error.message + "try/catch");
        }
        
    })
    .catch((err) => res.json(err.message + ".catch error"))
});



main.get("/getImage/:image",(req,res) =>{
    return res.sendFile("./public/images/"+req.params.image, {root: "./"})
})

main.get('/',(req,res) =>{
    UserModel.find({}).then(data =>{
        return res.render('display',{data})
    }).catch(error => {
        return res.status(201).json(error)
    })
})

main.get('/insertpage', (req,res)=> {
    res.render('insert');
})

main.post('/insert',fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}),(req,res)=>{
   
    req.files.image.mv('./public/images/'+req.files.image.name);
    var image = req.files.image.name
    const data = new UserModel({
        name:req.body.name,
        address:req.body.address,
        pic:image,
        email:req.body.email,
        password:req.body.password
    })

    data.save().then(result => {
        res.redirect("/")
    }).catch(error => console.log(error))
})

main.get('/display/:id',(req,res)=>{
    UserModel.findOne({_id:req.params.id}).then(data =>{
        return res.render('update',{data})
    }).catch(error =>{
        return res.status(201).json(error)
    })
})

main.post('/update/:id',fileupload({
    useTempFiles:true,
    tempFileDir:'/temp/'
}),(req,res)=>{
    req.files.image.mv('/../images/'+req.files.images);
    var image = req.files.image.name
    UserModel.updateOne({_id:req.params.id},{
        $set:{
            name:req.body.name,
            address:req.body.address,
            pic:image
        }
    },(err,data)=>{
        if(err) return res.status(201).json(err)
        else return res.redirect("/")
    })
})

main.get('/delete/:id',(req,res)=>{
    UserModel.deleteOne({_id:req.params.id}).then(result =>{
        return res.redirect("/");
    }).catch(error =>{
        return res.status(201).json(error)
    })
})

main.listen(3000, (req,res)=> {
    console.log("server is listening nigga");
});