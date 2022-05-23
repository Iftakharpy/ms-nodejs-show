const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const packageDescription = require("../package.json");
const serverPort = 5000;
const apiRoot = "/api";

// Simple db
const DB = {
  chris: {
    userName: "Christopher Harrison",
    currency: "usd",
    balance: 5009,
    description: "Simple bank account",
    transactions: [],
  },
  mike: {
    userName: "Mike Harris",
    currency: "usd",
    balance: 5000,
    description: "Mikes bank account",
    transactions: [],
  },
};

const app = express();
const router = express.Router();

// add router to the app
app.use(apiRoot, router);

// configure express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());

// Start express server
app.listen(serverPort, () => {
  console.log(`Server is up on port ${serverPort}`);
});

// Add api endpoints
router.get("/", (request, response) => {
  response.send(`${packageDescription.name} - v${packageDescription.version}`);
});

router.get("/accounts/:user", (request, response) => {
  let user = request.params.user;
  let userAccount = DB[user];

  if (userAccount === undefined) {
    return response.status(404).json({ error: "User account does not exist!" });
  }
  return response.json(userAccount);
});
