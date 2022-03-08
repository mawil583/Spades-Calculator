// TODO: // TODO: grab contentful accessToken and save it in secrets.env
// then I can uncomment this contentful config below

const client = require("contentful");

const contentful = client.createClient({
  accessToken: process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN,
  space: process.env.SPACE_ID,
});

module.exports = contentful;
