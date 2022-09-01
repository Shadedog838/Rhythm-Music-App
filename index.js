var express = require('express');
var app = express();

// Static hosting from the static folder
app.use(express.static(`${__dirname}/static/`));

// Start listening on the specified port
app.listen(3000);
