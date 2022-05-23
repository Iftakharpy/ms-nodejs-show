const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const packageDescription = require('../package.json')
const serverPort = 5000;
const apiRoot = '/api'


const app = express();
const router = express.Router()

// add router to the app
app.use(apiRoot, router)

// configure express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options("*", cors());

// Start express server
app.listen(serverPort, () => {
  console.log(`Server is up on port ${serverPort}`);
});


// Add get endpoint
router.get('/', (request, response)=>{
  response.send(`${packageDescription.name} - v${packageDescription.version}`)
})
