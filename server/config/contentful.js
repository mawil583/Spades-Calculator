const contentful = require("contentful");
require("dotenv").config({ path: "../secrets.env" });

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.SPACE_ID,
});

module.exports = client;
