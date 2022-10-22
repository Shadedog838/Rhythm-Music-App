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
            "select s.title, a.name, al.name as album_name, s.length, count(p.sid) as Times_Played" +
            " from artist as a, album as al, genre as g, song as s" +
            " LEFT JOIN plays as p on s.sid = p.sid" +
            " where s.artistid = a.artistid and s.albumid = al.albumid and s.genre_id = g.genreid" +
            " GROUP BY (s.title, a.name, al.name, s.length)" +
            " ORDER BY s.title, a.name ASC")
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
    }
});

// attribute: column to be sorted by
// condition: ASC or DESC
router.get("/sort/:attribute/:condition", async (req, res) => {
    try {
        const { attribute , condition} = req.params;
        
        const allNames = await pool.query(
            "select s.title, a.name, al.name as album_name, s.length, extract (year from s.releasedate) as year, count(p.sid) as Times_Played" +
            " from artist as a, album as al, genre as g, song as s" +
            " LEFT JOIN plays as p on s.sid = p.sid" +
            " where s.artistid = a.artistid and s.albumid = al.albumid and s.genre_id = g.genreid" +
            " GROUP BY (s.title, a.name, al.name, s.length, s.releasedate)" +
            " ORDER BY " + attribute + " " + condition
        );
        res.json(allNames.rows);
    } catch (err) {
        console.log(err.message);
    }
});

// attribute: column to search
// condition: term to search
router.get("/search/:attribute/:condition", async (req, res) => {
    try {
        const { attribute , condition} = req.params;
        console.log(attribute)
        const allNames = await pool.query(
            "select s.title, a.name, al.name as album_name, s.length, count(p.sid) as Times_Played" +
            " from artist as a, album as al, genre as g, song as s" +
            " LEFT JOIN plays as p on s.sid = p.sid" +
            " where s.artistid = a.artistid and s.albumid = al.albumid and s.genre_id = g.genreid and lower(" + attribute + ") like lower('%" + condition + "%')" +
            " GROUP BY (s.title, a.name, al.name, s.length) " +
            " ORDER BY s.title, a.name ASC"
        );
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
