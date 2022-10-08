// Backend entry point
// Authors: Daniel Chapin (dsc4948)

// Express for hosting
var express = require('express');
var app = express();
const port = 3000;

// Connect to database
const db = require('./db.js');
db.connect();

// Generated endpoints:
const { endpoints } = require('./endpoints.js');

// JSON parsing for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static hosting from the static folder
app.use(express.static(`${__dirname}/static/`));

// ================ //
// === HTTP GET === //
// ================ //

// 404 page
app.get('*', (req, res) => {
  res.send("You've entered an invalid URL (404)");
});

// ================= //
// === HTTP POST === //
// ================= //

// Template defined endpoints
(() => {
    for (let i in endpoints) {
        const endpoint = endpoints[i];
        const path = endpoint.path;
        const query = endpoint.query;
        const params = endpoint.params;

        app.post(path, (req, res) => {
            const user_params = req.body;
            let subs = Object.assign({}, params);
            subs = Object.assign(subs, user_params);
            let realized_query = query.slice();
            for (let key in subs) {
                const replacement = subs[key];
                const target = `\$\{${key}\}`;
                if (!replacement) {
                    res.status(409).send(`POST Endpoint ${path} requires parameter ${key}, but it was not specified.`);
                    return;
                }
                realized_query = realized_query.replaceAll(target, replacement);
            }

            db.query(realized_query)
            .then((data) => {
                res.status(200).send(data.rows);
            })
            .catch((err) => {
                console.log(`Error occured in POST ${path}`);
                console.log(err);
                res.status(500).send(err.toString());
            });
        });
    }
})();

// Start listening on the specified port
app.listen(port, () => {
  console.log(`Program listening on port ${port}`);
});

// Command line input
process.stdin.on('data', async (data) => {
    let input = data.toString().trim();
    db.query(input)
    .then((res) => {
        const rows = res.rows;
        for (row in rows) {
            console.log(rows[row]);
        }

        if (rows.length == 0) {
            console.log('{ Empty Response }');
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

console.log('Simply enter SQL queries to execute.');
