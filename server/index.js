// Express for hosting
const express = require('express');
const app = express();
const cors = require("cors")
const port = 5000;


app.use("/user", require("./routes/userRouter"));
app.use("/song", require("./routes/songRouter"));

// middleware
const pool = require('./db');
app.use(express.json());


// Start listening on the specified port
app.listen(port, () => {
    console.log(`Program listening on port ${port}`);
});
