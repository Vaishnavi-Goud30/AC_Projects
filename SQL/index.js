const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');
const express = require("express");                    //express
const app = express();                                 //express
const path = require("path");                          //ejs
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine", "ejs");                         //ejs
app.set("views", path.join(__dirname, "/views"));      //ejs

const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'lilly@mysql',
database: 'delta_app'
});

let getRandomUser = () =>{
    return[
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

//Home route
app.get("/", (req, res) =>{
    let q = `SELECT COUNT(*) FROM user`;
    try{
        connection.query(q, (err, result) =>{
            if(err) throw err;
            let count = result[0]["COUNT(*)"];
            res.render("home.ejs", { count });
        });
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }
});


//Show route
app.get("/user", (req, res) => {
    let q = "SELECT * FROM user";
    try{
        connection.query(q, (err, users) => {
            if(err) throw error;
            res.render("showusers.ejs", { users });
        }); 
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }
});

//Edit route
app.get("/user/:id/edit", (req,res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q, (err, result) => {
            if(err) throw error;
            let user = result[0];
            res.render("edit.ejs", { user });
        }); 
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }
});

// Update (DB) route
app.patch("/user/:id", (req, res) => {
    let {id} = req.params;
    let {password: formPass, username: newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;
            let user = result[0];
            if(formPass != user.password){
                res.send("WRONG password");
            } else{
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
            
        }); 
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }
});

//Adding a new user
app.get("/user/new", (req, res) => {
  res.render("add.ejs");
});

app.post("/user/new", (req, res) => {
    let { username, email, password} = req.body;
    let id = uuidv4();
    let q = `INSERT INTO user(id, username, email, password) VALUES('${id}', '${username}', '${email}', '${password}')`;
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;
            res.redirect("/user");
            console.log("sucessfully added a new user");
        });
    } catch(err){
        console.log(err);
        res.send("Some error in DB");
    }
});

//Delete user
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("Some error with DB");
    console.log(err);
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("INCORRECT Password !");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted sucessfully..!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});


app.listen("8080", () => {
    console.log("server listening to port 8080");
});

//Inserting new data
// let q = "INSERT INTO user(id, username, email, password) VALUES ?";

// let data = [];
// for(let i=1; i<=100; i++){
//     data.push(getRandomUser()); //100 fake users
// }

// 


