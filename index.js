// Backend entry point
// Authors: Daniel Chapin (dsc4948)

// Express for hosting
var express = require('express');
var app = express();
const port = 3000;

// Connect to database
const db = require('./db.js');
db.connect();

// Static hosting from the static folder
app.use(express.static(`${__dirname}/static/`));

// ================ //
// === HTTP GET === //
// ================ //

// 404 page
app.get('*', (req, res) => {
  res.send("You've entered an invalid URL (404)");
});

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
