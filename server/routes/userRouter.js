// Routes for all USER related operations //
/*
                    IMPLEMENTED METHODS 
    * Register user
    * login user
    * create user playlist
    * get user's playlist
*/
const express = require("express");
const router = express.Router();
const pool = require("../db")
const bcrypt = require("bcrypt");
const { response } = require("express");

//Register user
router.post("/register", async (req, res) => {
    var cusername = req.body.username
    var fName = req.body.firstname
    var lName = req.body.lastname
    var Password = req.body.password
    var email = req.body.email
    query = `INSERT INTO users(username,firstname,lastname,email,password)VALUES($1,$2,$3,$4,$5)`
    //checking if username or password exists
    pool.query(`SELECT COUNT(*) FROM users WHERE username=$1 or email=$2 ;`, [cusername, email], async(error, value) => {
        if (error) {
            res.status(500)
        }
        console.log(value)
        if (value.rowCount < 1 || Number(value.rows[0].count)>= 1) {
            res.sendStatus(409)
        }else{
        const saltval = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(Password, saltval)
        const queryInput = [cusername, fName, lName, email, hashedPassword]
        //inserting new user with unique username and passowrd
        pool.query(query, queryInput, (error, value) => {
            if (error) {
                console.log(error)
                res.sendStatus(500)
            }
            if (value) {
                res.sendStatus(201)
            }
        })}
    })

})

//Log in user 
router.post("/login", async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const query = `SELECT password FROM users WHERE username=$1`

    //geting hashed password form the database
    pool.query(query,[username], async(error,dataobj)=>{
        if(error){
            console.log(error)
            res.sendStatus(500)
        }
        // comparig passwords 
        if( dataobj.rowCount==1 && await bcrypt.compare(password,dataobj.rows[0].password)){
            res.status(200).json({"message":"loggedin"})
        }else{
            res.status(401).json({"message":"loginFailed"})
        }
    })
    

})

router.post("/createplaylist", async(req,res)=>{
    const playlistname = req.body.name
    const username = req.body.username
    const userString = "Select username from users where username= $1"
    pool.query(userString,[username], (error, response)=>{
        if(error){
            console.log(error)
            res.sendStatus(500)
        }
        if(!response || response.rowCount == 0){
            res.status(404).json({"message":"user not found"})
            return
        }
        const playlistString = "Insert into playlist(username,name) values ($1,$2)"
        pool.query(playlistString,[username,playlistname], (error, inserted)=>{
            if(error){
                console.log(error)
                res.sendStatus(500)
                return
            }
            if(inserted){
                res.sendStatus(201)
            }
        })
    })
})


router.get("playlists/:userId", async(req,res)=>{
    const userquerystring = 'Select username from users where username==$1'
    pool.query(userquerystring,[req.params.userId], (error,response)=>{
        if(error){
            console.log(error)
            res.sendStatus(500)
            return;
        }
        if(response.rowCount <1){
            res.sendStatus(404)
            return;
        }
        const playlistqueryString = "Select (pid , name) from playlist where username=$1"
        pool.query(playlistqueryString,[req.params.userId],(error,listofplaylist)=>{
            if(error){
                console.log(error)
                res.sendStatus(500)
                return
            }
            if(listofplaylist.rowCount < 1){
                res.sendStatus(404)
                return
            }



        })

    })

})

module.exports = router;

