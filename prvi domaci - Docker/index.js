const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const www = process.env.WWW || './';

app.get('/', (req, res) => {
  res.send("Hello World from Docker!");
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
