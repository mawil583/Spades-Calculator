"use strict";

require("dotenv").config({ path: "./secrets.env" });
const Hapi = require("@hapi/hapi");
const contentful = require("./config/contentful");

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      //   // cors: true,
      cors: {
        origin: ["*"], // an array of origins or 'ignore'
        credentials: true, // boolean - 'Access-Control-Allow-Credentials'
      },
    },
  });

  server.route([
    {
      method: "GET",
      path: "/",
      handler: async (request, h) => {
        console.log("hi");
        const response = h.response("Hello World!");
        console.log({ serverResponse: response });
        return response;
      },
    },
    // TODO: // TODO: after contentful accessToken is set up, I can uncomment this route handler
    {
      method: "GET",
      path: "/entries",
      handler: async (request, h) => {
        console.log("cats");
        const entries = await contentful.getEntries();
        const response = h.response(entries);
        return response;
      },
    },
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log("hi");
  console.log(err);
  process.exit(1);
});

init();
