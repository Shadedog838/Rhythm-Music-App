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
        "SELECT s.title, a.name, s.length, count(p.sid) as Times_Played" +
        " FROM artist as a, artist_song as sa, song as s" +  
        " Left join plays as p on s.sid = p.sid" + 
        " WHERE s.sid = sa.sid AND sa.artistid = a.artistid" +
        " GROUP BY(s.title, a.name, s.length)" + 
        " ORDER BY  s.title, a.name ASC;");
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
    }
});

router.get("/sort", async (req, res) => {
    try {
        const { attribute} = req.body;
        console.log(attribute);
        const allNames = await pool.query(
        "SELECT s.title, a.name, s.length, count(p.sid) as Times_Played" +
        " FROM artist as a, artist_song as sa, song as s" +  
        " Left join plays as p on s.sid = p.sid" + 
        " WHERE s.sid = sa.sid AND sa.artistid = a.artistid" +
        " GROUP BY(s.title, a.name, s.length)" + 
        " ORDER BY " + attribute
        );
        // console.log("SELECT s.title, a.name, s.length, count(p.sid) as Times_Played" +
        // " FROM artist as a, artist_song as sa, song as s" +  
        // " Left join plays as p on s.sid = p.sid" + 
        // " WHERE s.sid = sa.sid AND sa.artistid = a.artistid" +
        // " GROUP BY(s.title, a.name, s.length)" + 
        // " ORDER BY $1;",
        // [attribute]);
        res.json(allNames.rows);
    } catch (err) {
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
