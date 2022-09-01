var express = require('express');
var app = express();
const port = 3000;

// Static hosting from the static folder
app.use(express.static(`${__dirname}/static/`));

// 404 page
app.get('*', (req, res) => {
  res.send("You've entered an invalid URL (404)");
});

// Start listening on the specified port
app.listen(port, () => {
  console.log(`Program listening on port ${port}`);
});
