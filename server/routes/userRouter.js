// Routes for all USER related operations //
/*
                    IMPLEMENTED METHODS 
    * Register user
    * login user
    * create user playlist
    * get all user's playlist
    * modfigy playlist name
    * get songs from specific playlist
    * add song to playlist
    * remove song from playlist
    * search user email
    * follow user
    * unfollow user
    * play whole playlist
    * delete playlist
*/
const express = require("express");
const router = express.Router();
const pool = require("../db")
const bcrypt = require("bcrypt");

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
            var date = new Date()
            pool.query("UPDATE users SET lastaccessdate=$1 where username=$2",[date.toISOString(),username], (error,response)=>{
                if(error){
                    console.log(error)
                    res.sendStatus(500)
                }
                res.status(200).json({"message":"loggedin","username":`${username}`})
            })
        }else{
            res.status(401).json({"message":"loginFailed"})
        }
    })
    

})

// create user playlist
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

// get all playlist for a user
router.get("/playlists/:userId", async(req,res)=>{
    const userquerystring = 'SELECT * from users where username=$1'
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
        const playlistqueryString=`select p.name, p.username,p.pid, count(pc.sid) as total_songs, sum(s.length)
        as total_time from playlist as p, playlist_contains as pc, song as s
        where p.username=$1 and p.pid=pc.pid and s.sid=pc.sid group by (p.pid,p.username,p.name) group by p.name ASC`
        
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
            res.status(200).json(listofplaylist.rows)
        })

    })
})

//modify playlist name
router.put("/playlist/modifyname", (req,res)=>{
    const userName = req.body.username
    const newName = req.body.newname
    const previousName = req.body.playlistname 
    const queryString = `update playlist set name=$1 where username=$2 AND name=$3 returning name;`
    pool.query(queryString,[newName,userName,previousName],(error,update)=>{
        if(error){
            res.sendStatus(500)
            return;
        }
        if(update.rowCount ==1){
            res.status(200).json(update.rows[0])
            return;
        }
        res.sendStatus(400)
    })


})

// get songs from specfic playslist id
router.get("/playlist/:pid", async (req,res) =>{
    try{
        const pid = req.params.pid;
        const allNames = await pool.query(
            `SELECT p.name as Playlist_name,  s.title, s.length, s.releasedate,a.name as artist,al.name as album
            from song as s, playlist_contains as pc, playlist as p, artist  as a,album as al
            where p.pid=$1 and pc.pid = p.pid and pc.sid = s.sid and al.albumid = s.albumid and a.artistid=s.artistid
            group by (p.name, a.name,al.name,s.title,s.length,s.releasedate,s.sid) order by s.title ASC`,[pid]
        );
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message)
    }
});


//add song to playlist
router.post("/playlist/addsong", async (req, res) => {
    try {
        const pid = req.body.pid;
        const songID = req.body.sid;
        const allNames = await pool.query(
            "INSERT INTO playlist_contains(pid,sid)VALUES ($1,$2)",[pid,songID]
        );
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500)
    }
});

// remove song from playlist
router.delete("playlist/deletesong", async (req,res)=> {
    try{
        const pid = req.body.pid;
        const songID = req.body.sid;
        const allNames = await pool.query(
            "DELETE FROM playlist_contains WHERE pid = $1 AND sid = $2",[pid,songID]
        );
        res.json(allNames.rows);
    } catch(err) {
        console.log(err.message);
    }
});

//search by email
router.get("/usersearch/:attribute", async (req, res) => {
    try {
        const attribute = req.params.attribute;
        console.log(attribute)
        const allNames = await pool.query(
            "select email, username" +
            " from users" +
            " where lower(email) like lower('%" + attribute + "%')" 
        );
        console.log(allNames)
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
    }
});

//follow user
router.post("/follow", async (req,res)=> {
    try{
        const username1 = req.body.username1;
        const username2 = req.body.username2;
        
        const allNames = await pool.query(
            "INSERT INTO follow(followid,followedbyid)VALUES ($1,$2)",[username1,username2]
           
        );
        res.json(allNames.rows);
    } catch(err) {
        console.log(err.message);
    }
});

//unfollow user
router.delete("/unfollow", async (req,res)=> {
    try{
        const username1 = req.body.username1;
        const username2 = req.body.username2;
        const allNames = await pool.query(
            "DELETE FROM follow WHERE followid = $1 AND followedbyid = $2",[username1,username2]
        );
        res.json(allNames.rows);
    } catch(err) {
        console.log(err.message);
    }
});

//play whole playlist
router.post("/playlist/play", async (req,res)=> {
    try{
        const username = req.body.username;
        const pid = req.body.pid;
        const date = new Date();
        const allNames = await pool.query(
            "INSERT INTO plays(username,sid,datetimeplayed) select $1, sid, $3 from playlist_contains where pid=$2",[username,pid, date.toISOString()]
        );
        res.json(allNames.rows);
    } catch(err) {
        console.log(err.message)
    }
});
//delete playlist
router.delete("/playlist/delete", async (req,res)=> {
    try{
        const username = req.body.username;
        const pid = req.body.pid
        pool.query("select * from playlist where username =$1 and pid=$2",[username,pid], async (error,value)=>{
            if(error){
                console.log(error)
                res.sendStatus(500)
                return
            }
            if(value.rowCount ==0 || !value){
                res.sendStatus(401)
                return
            }
            const pp = await pool.query(
                "DELETE FROM playlist_contains WHERE pid = $1",[pid] 
            )
            const allNames = await pool.query(
                "DELETE FROM playlist WHERE pid = $1",[pid]
            );
            res.json(allNames.rows);

        })
        
       
    } catch(err){
        console.log(err.message)
    }
});

module.exports = router;

