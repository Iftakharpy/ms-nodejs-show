const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const serverPort = 5000;

const app = express();
// configure express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());


app.listen(serverPort, () => {
  console.log(`Server is up on port ${serverPort}`);
});
