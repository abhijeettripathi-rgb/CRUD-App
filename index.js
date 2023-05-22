const express = require("express");
const body_parser = require("body-parser");
const app = express();
app.use(body_parser.urlencoded({ extended: true }));


// Serve static files from the "public" directory
app.use(express.static("public"));

// MongoDB schema for person details
const mongoose = require("mongoose");

// connecting the database
mongoose
  .connect(
    "mongodb+srv://demo1:demo1@cluster.jwf5duu.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  });

// Define the person schema
const personSchema1 = new mongoose.Schema({
  _id: {type: String, required:true} , 
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  message: { type: String, required: true },
});

// Create the Person model
const Person1 = mongoose.model("Person1", personSchema1);

// 1.Create Employee with multiple contact details
app.post("/post", async(req, res) => {
  const dat = req.body;
  console.log(dat);
  const newPerson = new Person1({
    _id: dat.UserID,
    name: dat.name,
    email: dat.email,
    address: dat.address,
    phone: dat.phone,
    message: dat.message,
  });
  await newPerson.save()
  .then(()=>{
      res.redirect('/list');
    })
    .catch(()=>{    
      res.send("Invalid UserId");
  })
});


// 2.List Employee
app.get("/list", async (req, res) => {
  const per = await Person1.find({});
  res.send(per);
});


// 3.Delete Employee
app.get('/delete',(req,res)=>{
    res.sendFile(__dirname+"/delete.html");
})

app.post('/delete',async(req,res)=>{
 const n=req.body.UserID;
 const myquery={_id:n};
 await Person1.deleteOne(myquery)
res.redirect('/list');
});


// update employees

app.get('/update',(req,res)=>{
    res.sendFile(__dirname+"/update.html");
});

app.post('/update',async(req,res)=>{
    const n=req.body.UserID;
    await Person1.findByIdAndUpdate({_id:n},req.body);
    res.redirect('/list')
});



// get employees

app.get('/getuser',(req,res)=>{
    res.sendFile(__dirname+"/user.html");
})

app.post('/getuser',async(req,res)=>{
    const n=req.body.UserID;
    const user=await Person1.findById({_id:n});
    // console.log(user);
    res.send(user);
})



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
