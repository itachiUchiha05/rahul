 const express = require("express")

 const temp = express();
const mongoose = require("mongoose")

 const fileupload = require("express-fileupload")

 mongoose.connect("mongodb://localhost:27017/rahul",{useNewUrlParser:true})
 
 const userschema = new mongoose.Schema({
     name:String,
     course:String,
     year:String,
     pic:String
 })

 const usermodel = mongoose.model('course', userschema)

temp.use(express.urlencoded({extended:true}))

temp.set('view engine','ejs')
temp.set('static','./views/')

temp.get('/getImage/:image', (req,res) =>{
    return res.sendFile('./public/images/'+req.params.image , {root:'./'})
})

temp.get('/',(req,res) => {
    usermodel.find({}).then(data => {
        return res.render('display',{data})
    }).catch(err => {
        return res.status(201).json(err)
    })
})

temp.get('/insertpage', (req,res) => {
    res.render('insert')
})

temp.post('/insert',fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}),(req,res)=>{

    req.files.image.mv('./public/images/'+req.files.image.name);
    var image = req.files.image.name
  
    const data = new usermodel({
        name:req.body.name,
        course:req.body.course,
        year:req.body.year,
        pic:image
    })

    data.save().then(result => {
        return res.redirect('/')
    }).catch(err => console.log(err))
})

temp.get('/display/:id',(req,res) => {
    usermodel.findOne({_id:req.params.id}).then(data => {
        return res.render('update',{data})
    }).catch(err => {
        return res.status(201).json(err)
    })
})

temp.post('/update/:id', fileupload ({
    useTempFiles:true,
    tempFileDir:'/temp/'
}),(req,res) => {
    req.files.image.mv('/../public/image'+req.files.image.name)
    var image = req.files.image.name
    usermodel.updateOne({_id:req.params.id},{
        $set:{
            name:req.body.name,
            course:req.body.course,
            year:req.body.year,
            pic:image
        }
    },(err,data) => {
        if(err) return res.status(201).json(err)
        else return res.redirect('/')
    })
})


temp.get('/delete/:id',(req,res) =>{
    usermodel.deleteOne({_id:req.params.id}).then(result => {
      return res.redirect('/')
    }).catch(err => {
        return res.status(201).json(err)
    })
})

temp.listen(1005,(req,res) =>{
    console.log('listening niggaa')
})