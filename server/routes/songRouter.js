// Routes for all SONG related operations //

const express = require ("express");
const router = express.Router();
const pool = require ("../db")

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


router.get("/song", async (req, res) => {
    try {
        const allNames = await pool.query("SELECT title FROM song");
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
