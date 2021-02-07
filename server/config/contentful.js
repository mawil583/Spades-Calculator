const client = require("contentful");

const contentful = client.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.SPACE_ID,
});

module.exports = contentful;
