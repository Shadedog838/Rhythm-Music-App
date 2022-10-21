// Routes for all USER related operations //
const { query } = require("express");
const express = require("express");
const router = express.Router();
const pool = require("../db")
const bcrypt = require("bcrypt")

router.post("/register",async(req,res)=>{
    var username = req.body.username
    var fName= req.body.firstNname
    var lName= req.body.lastname
    var Password= req.body.password
    var email= req.body.email
    
    var query = `SELECT  COUNT(SELECT username FROM users WHERE username=${username})`
    var hasUser = await pool.query(query)
    if(!hasUser){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        query = `INSERT INTO users (username, firstname, lastname, email, password, createddate, lastdateaccess) values (${username}, ${fName},${lName}, ${email},${hashedPassword},${Date.UTC()},${Date.UTC()}) `
        try{
            await pool.query(query)
        }catch(e){
            res.statusCode(500)
        }
    }else{
        res.statusCode(409)
    }
})

router.post("/login", async(req,res)=>{
    var username = req.body.username
    var password = req.body.password
    var query = `SELECT password FROM users WHERE username = ${username}`
    pool.query(query, async(error,result)=>{
        if(error){
            res.status(404)
        }else{
            if(bcrypt.compare(result["password"], password)){
                res.status(200).json(result)
            }
            else{
                res.status(404)
            }
        }
    })

})




module.exports = router;

