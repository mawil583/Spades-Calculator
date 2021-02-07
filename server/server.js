"use strict";

require("dotenv").config({ path: "./secrets.env" });
const Hapi = require("@hapi/hapi");
const contentful = require("./config/contentful");

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
    routes: {
      cors: true,
    },
  });

  server.route([
    {
      method: "GET",
      path: "/",
      handler: async (request, h) => {
        const response = h.response("Hello World!");
        return response;
      },
    },
    {
      method: "GET",
      path: "/entries",
      handler: async (request, h) => {
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
  console.log(err);
  process.exit(1);
});

init();
