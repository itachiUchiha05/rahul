const express = require("express");

const test = express();

const mongoose = require("mongoose");

const fileupload = require("express-fileupload")

mongoose.connect("mongodb://localhost:27017/testone",({useNewUrlParser:true}))

const userschema = mongoose.Schema({
    eno:String,
    fname:String,
    city:String,
    pic:String
})

const usermodel = mongoose.model('emp',userschema)

test.set('view engine','ejs')
test.set('static','./views/')

test.use(express.urlencoded({extended:true}))

test.get('/getImage/:image',(req,res) =>{
    return res.sendFile('/publuc/images/'+req.params.image, {root:'./'})
})

test.get('/',(req,res) => {
    usermodel.find({}).then(data=> {
        return res.render('testdisplay',{data})
    }).catch(err =>{
        return res.status(201).json(err)
    }) 
})

test.get('/insertpage',(req,res)=>{
    return res.render('testinsert')
})


test.post('/testinsert',fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}),(req,res)=>{

    req.files.image.mv('./public/images/'+req.files.image.name);
    var image = req.files.image.name
  
    const data = new usermodel({
        eno:req.body.eno,
        fname:req.body.fname,
        city:req.body.city,
        pic:image
    })

    data.save().then(result => {
        return res.redirect('/')
    }).catch(err => console.log(err))
})



test.get('/testdisplay/:id',(req,res)=>{
    usermodel.findOne({_id:req.params.id}).then(data=>{
        return res.render('testupdate',{data})
    }).catch(err =>{
        return res.status(201).json(err)
    })
})

test.post('/testupdate/:id',fileupload({
    useTempFiles:true,
    tempFileDir:'/temp/'
}),(req,res) => {
    req.files.image.mv('/../public/images'+req.files.image.name)

    var image = req.files.image.name;

    usermodel.updateOne({_id:req.params.id},{
        set:{
            eno:req.body.eno,
            fname:req.body.fname,
            city:req.body.city,
            pic:image
        }
    },(err,data) => {
        if(err) return res.status(201).json(err)
        else return res.redirect('/')
    })
})

test.get('/testdelete/:id',(req,res) =>{
    usermodel.deleteOne({_id:req.params.id}).then(result =>{
        return res.redirect('/')
    }).catch(err => {
        return res.status(201).json(err)
    })
})

test.listen('2001',(req,res) =>{
    console.log('ok nigga')
})