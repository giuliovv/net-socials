// src/square.js

const { Client, Environment } = require('square');

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox, // Change to Environment.Production for production
});

module.exports = { squareClient };
