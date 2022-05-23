const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuid = require('uuid')

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

// configure express app
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register router to the app
app.use(apiRoot, router);


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

router.get('/accounts', (request, response)=>{
  response.send(DB)
})

router.post('/accounts', (request, response)=>{
  let payload = request.body

  // validate required values
  if (!payload?.userName || !payload?.currency || !payload?.userId){
    return response.status(400).send({error: 'userName and currency is required'})
  }
  
  // check if account already exist
  if (DB[payload?.userId]){
    return response.status(400).send({error: 'Account already exists'})
  }

  // check balance
  let balance = payload?.balance
  if (balance && typeof(balance)!=='number'){
    balance = parseFloat(balance)
    if (isNaN(balance)){
      return response.status(400).send({error: 'balance must be a number'})
    }
  }

  let account = {
    userName: payload.userName,
    currency: payload.currency,
    description: payload.description || `${payload.userName}'s account`,
    balance: balance||0,
    transactions: []
  }
  DB[payload.userId] = account
  return response.json(account)
})
