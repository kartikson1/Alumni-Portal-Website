const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const axios = require('axios');
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

// parse application/json
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json());

// Database Crendential Omitted


//connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

//Starting Pages
app.get("/",function(req,res){
  res.render("landing");
});

app.get("/intro",function(req,res){
  res.render("intro",{data: req.cookies["loggedin"]});
});

//Login APIs
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  var sql = 'SELECT password FROM alumni_list WHERE alumni_email = "' + req.body.alumni_email + '"' ;
  let query = conn.query(sql, (err, l) => {
    if (err) throw err; 
  if(l.length==0){
    console.log(l);
   console.log("You aren't registered");
    res.redirect("/register");
  }
  else {
    q = l[0]["password"];
    console.log(q);
    if(q == req.body.password)
    {
      res.cookie("email",req.body.alumni_email);
      res.cookie("loggedin","yes");
      res.redirect("/intro");
    } else {
      console.log("Your password is wrong");
    }
  }
  });
})

//show all users
app.get('/api/users', (req, res) => {
  let sql = "SELECT * FROM alumni_list ";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    // res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
    res.render("profiles",{data:results});
  });
});


//Register APIs
app.get("/register",function(req,res){
  res.render("register");
});


//Edit Profile APIs
app.get("/profile/edit/",function(req,res){
  console.log(req.cookies);
  console.log(req.cookies["email"]);
  // console.log(req.cookie["email"]);
  // console.log(req.cookies.email);
  var sql = 'SELECT * FROM alumni_list WHERE alumni_email = "' + req.cookies["email"] + '"' ;
  let query = conn.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results);
     res.render("edit-profile",{data:results[0]});
});
});

app.post('/api/users', (req, res) => {
  console.log(req.body);
    var queries = `INSERT INTO alumni_list (alumni_name,alumni_email,alumni_phone,degree,college,company,status,password) VALUES ("${req.body.alumni_name}","${req.body.alumni_email}","${req.body.alumni_phone}","${req.body.degree}" ,"${req.body.college}","${req.body.company}","undefined","${req.body.password}")`;
    let query = conn.query(queries, (err, results) => {
      if (err) {
        throw err;
      }
      res.cookie("email",req.body.alumni_email);
      res.cookie("loggedin","yes");
      res.redirect("/intro");
  });
});



app.post('/api/users/update', (req, res) => {
  console.log("hhhhhh");
  console.log(req.body);
 let queries = "UPDATE alumni_list SET alumni_name = ? ,alumni_email = ?,alumni_phone = ? ,degree = ? ,college = ?,company = ?,status = ? ,password = ? WHERE alumni_email=?";

  let data = [req.body.alumni_name,req.body.alumni_email,req.body.alumni_phone,req.body.degree ,req.body.college,req.body.company,"unverified",req.body.password,req.body.alumni_email];
   let query = conn.query(queries,data,(err, results) => {
      if (err) {
        throw err;
      }
      console.log(results);
      res.redirect("/intro");
  });
});


app.get("/api/users/:alumni_email",function(req,res){
  var q = 'SELECT * FROM alumni_list WHERE alumni_email = "' + req.params.alumni_email + '"' ;
  conn.query(q,function(err,results){
    console.log(results);
    res.render("profile",{data:results[0]});
  });
});

// app.get("/profilealumni",function(req,res){
//   res.render("profilealumni");
// })

//Events APIs
app.get("/events", function(req,res){
  res.render("events");
});

app.get("/viewevent", function(req,res){
  res.render("event");
});

app.post('/api/events', (req, res) => {
  console.log(req.body);
    var queries = `INSERT INTO events (title,venue,description,fees,organiser) VALUES ("${req.body.title}","${req.body.venue}","${req.body.description}","${req.body.fees}" ,"${req.body.organiser}")`;
    let query = conn.query(queries, (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results);
      res.redirect("/events");

  });
});

app.get("/api/events/create", function(req,res){
  res.render("eventcreate");
});


// Profile APIs
app.get("/viewprofile", function(req,res){
  res.render("profile");
});

app.get("/myprofile", function(req,res){
  var q = 'SELECT * FROM alumni_list WHERE alumni_email = "' + req.cookies["email"] + '"' ;
  let query = conn.query(q, (err, results) => {
    if (err) {
      throw err;
    }
    console.log(results[0]);
    res.render("myprofile",{data: results[0]});

});
});

app.get("/logout",(req,res)=>{
  res.clearCookie("email");
  res.cookie("loggedin","no");
  res.redirect("/login");
});

  
//Server listening
app.listen(8000, () => {
  console.log('Server started on port 8000...');
});