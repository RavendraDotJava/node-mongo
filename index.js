const { MongoClient, ObjectId } = require("mongodb");
const express = require('express');
const app = express();
//const client = require('./db');
var bodyParser = require('body-parser')
const multer  = require('multer')
const cors = require('cors');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname) 
  }
})

var upload = multer({ storage: storage });

const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);


app.set('view engine', 'ejs');
var bodyParser = bodyParser.urlencoded({ extended: true });



//index
app.get("/", (req, res) => {
  async function connet() {
    try {
      await client.connect();
      const db = client.db("firstTest");
      const coll = db.collection("Student");
      const d= (await coll.find({}).toArray());
      res.render("index",{data:d});
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  connet();
})

//Insert
app.post("/send", upload.single('file'), (req, res) => {
 console.log(req.file.filename);
var obj={
  name:req.body.name,
  email:req.body.email,
  gender:req.body.gender,
  text:req.body.text,
  file:req.file.filename
}

  async function connet() {
    try {
      await client.connect();
      await client.db("firstTest").collection("Student").insertOne(obj);
      const db = client.db("firstTest");
      const coll = db.collection("Student");
      const d= (await coll.find({}).toArray());
      res.render("index",{data:d });
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  connet();
}) 


//delete
app.get("/delete/:Id",(req,res)=>{
    let id=req.params.Id;
   
    del(id);
    async function del(id) {
      try {
        await client.connect();
        const db= await client.db("firstTest");
        const count =await (await db.collection("Student").deleteOne({_id:new ObjectId(id)})).deletedCount;
        //console.log(count);
        if (count!=0) {
           res.redirect("/");
        }
      } catch (error) {
        console.log(error);
      }finally{
        client.close();
      }
    }
   
})


//update
app.get("/update/:Id",(req,res)=>{
  let id= req.params.Id;
  //console.log(id);
  getdata(id);
  async function getdata(id) {
    try {
      await client.connect();
     // await client.db("firstTest").collection("Student").insertOne(req.body);
      const db = client.db("firstTest");
      const coll = db.collection("Student");
      const d= (await coll.findOne({_id: new ObjectId(id)}));
      res.render("update",{single:d});
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
  
 
})

app.post("/update",bodyParser,(req,res)=>{
  let id=req.body.id;
  var obj={
    name:req.body.name,
    email:req.body.email,
    gender:req.body.gender,
    text:req.body.text,
  }
  console.log(JSON.stringify(obj));
 
  update(id,obj);
  
  async function update(id,obj) {
    try {
      await client.connect();
      const db= await client.db("firstTest");
      const count =await (await db.collection("Student")
      .updateOne({_id: new ObjectId(id)},{$set:obj})).modifiedCount;
      
      if (count!=0) {
        res.redirect("/");
      }
      
    } catch (error) {
      console.log(error);
    }finally{
      client.close();
    }
  }

})



app.listen(5000, () => console.log("Server Started"))