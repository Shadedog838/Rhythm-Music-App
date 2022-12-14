// Routes for all SONG related operations //

const express = require("express");
const router = express.Router();
const pool = require("../db")

// Generated endpoints:
// const { endpoints } = require('./endpoints.js');

// JSON parsing for POST requests
// app.use(express.urlencoded({ extended: true }));


// ================ //
// === HTTP GET === //
// ================ //

// app.get("/test", async (req, res) => {
//     try {
//         const allNames = await pool.query("SELECT * FROM test");
//         res.json(allNames.rows);
//     } catch (err) {
//         console.log(err.message);
//     }
// });


router.get("/", async (req, res) => {
    try {
        const allNames = await pool.query(
            "select s.sid, s.title, a.name, al.name as album_name, s.length, g.name as genre, count(p.sid) as Times_Played" +
            " from artist as a, album as al, genre as g, song as s" +
            " LEFT JOIN plays as p on s.sid = p.sid" +
            " where s.artistid = a.artistid and s.albumid = al.albumid and s.genre_id = g.genreid" +
            " GROUP BY (s.sid, s.title, a.name, al.name, s.length, g.name)" +
            " ORDER BY s.title, a.name ASC")
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// attribute: column to be sorted by
// condition: ASC or DESC
router.get("/sort/:attribute/:condition", async (req, res) => {
    try {
        const { attribute , condition} = req.params;
        const allNames = await pool.query(
            "select s.sid, s.title, a.name, al.name as album_name, s.length, g.name as genre, extract (year from s.releasedate) as year, count(p.sid) as Times_Played" +
            " from artist as a, album as al, genre as g, song as s" +
            " LEFT JOIN plays as p on s.sid = p.sid" +
            " where s.artistid = a.artistid and s.albumid = al.albumid and s.genre_id = g.genreid" +
            " GROUP BY (s.sid, s.title, a.name, al.name, s.length, g.name, s.releasedate)" +
            " ORDER BY " + attribute + " " + condition
        );
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// attribute: column to search
// condition: term to search
router.get("/search/:attribute/:condition", async (req, res) => {
    try {
        const { attribute , condition} = req.params;

        const allNames = await pool.query(
            "select s.sid, s.title, a.name, al.name as album_name, s.length, g.name as genre, count(p.sid) as Times_Played" +
            " from artist as a, album as al, genre as g, song as s" +
            " LEFT JOIN plays as p on s.sid = p.sid" +
            " where s.artistid = a.artistid and s.albumid = al.albumid and s.genre_id = g.genreid and lower(" + attribute + ") like lower('%" + condition + "%')" +
            " GROUP BY (s.sid, s.title, a.name, al.name, s.length, g.name) " +
            " ORDER BY s.title, a.name ASC"
        );
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

router.post("/plays", async(req,res) => {
    let client;
    try {
        const username = req.body.username;
        const sid = req.body.sid;
        const date = new Date();
        client = await pool.connect();
        const allNames = await client.query(
            "INSERT INTO plays(username,sid,datetimeplayed)VALUES ($1,$2,$3)",[username,sid, date.toISOString()]
        );
        res.json(allNames.rows);
    } catch (err) {
        console.log('Error in /plays');
        console.log(err.message);
        res.status(500).send("Server Error");
    }
    if (client) client.release();
});

router.get("/albums", async (req, res) => {
    try {
        const allNames = await pool.query(
            "select al.name as album, a.name as artist, al.albumid as album_id FROM artist as a, album as al WHERE al.artistid = a.artistid"
        );
        // console.log(allNames)
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
    }
});

// get all the songs and its info
router.get("/album/:id", async(req,res)=>{
    const albumid = req.params.id
    const query = `select al.albumid, al.name as album_name, a.name as artist_name, s.sid, s.title, s.length,s.releasedate, s.track_number
                    from album as al, artist as a, song as s
                    where al.albumid = s.albumid and al.albumid = $1 and al.artistid=a.artistid`
    pool.query(query,[albumid], (error, val)=>{
        if(error){
            res.sendStatus(500)
            return
        }
        res.status(200).json(val.rows)
    })
});

//top songs of last 30 days
router.get("/topsongs30", async (req,res) => {
    try{
      const allNames = await pool.query(
        `SELECT  s.title, count(p.sid) as play FROM song as s, plays as p 
        WHERE s.sid = p.sid AND p.datetimeplayed BETWEEN now()- interval '30 day' AND now() GROUP BY(s.title) ORDER BY (play) DESC LIMIT 50`
      );
      res.json(allNames.rows);
    } catch(err){
      console.log(err.message);
    }
  });

  //top 5 genre of this month
router.get("/topgenre5", async (req,res) => {
    try{
      const allNames = await pool.query(
        `SELECT  g.name, count(p.sid) as play FROM song as s, plays as p, genre as g
        WHERE s.sid = p.sid AND g.genreid = s.genre_id  AND extract(MONTH  FROM now())  = extract(MONTH FROM p.datetimeplayed)
        AND extract(Year  FROM now())  = extract(Year FROM p.datetimeplayed)
        GROUP BY (g.name) ORDER BY (play) DESC LIMIT 5`
      );
      res.json(allNames.rows);
    } catch(err){
      console.log(err.message);
    }
  });

module.exports = router;
// ================= //
// === HTTP POST === //
// ================= //

// Template defined endpoints
// (() => {
//     for (let i in endpoints) {
//         const endpoint = endpoints[i];
//         const path = endpoint.path;
//         const query = endpoint.query;
//         const params = endpoint.params;

//         app.post(path, (req, res) => {
//             const user_params = req.body;
//             let subs = Object.assign({}, params);
//             subs = Object.assign(subs, user_params);
//             let realized_query = query.slice();
//             for (let key in subs) {
//                 const replacement = subs[key];
//                 const target = `\$\{${key}\}`;
//                 if (!replacement) {
//                     res.status(409).send(`POST Endpoint ${path} requires parameter ${key}, but it was not specified.`);
//                     return;
//                 }
//                 realized_query = realized_query.replaceAll(target, replacement);
//             }

//             db.query(realized_query)
//             .then((data) => {
//                 res.status(200).send(data.rows);
//             })
//             .catch((err) => {
//                 console.log(`Error occured in POST ${path}`);
//                 console.log(err);
//                 res.status(500).send(err.toString());
//             });
//         });
//     }
// })();
