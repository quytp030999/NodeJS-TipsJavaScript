const mongoose = require("mongoose");

var newConnection = (uri) => {
  const conn = mongoose.createConnection(uri);

  conn.on("connected", () => {
    console.log(`MongoDb::: connected::: ${uri}`);
  });

  conn.on("disconnected", () => {
    console.log(`MongoDb::: disconnected::: ${uri}`);
  });

  conn.on("error", (error) => {
    console.log(`MongoDb::: error::: ${JSON.stringify(error)}`);
  });

  process.on("SIGINT", async () => {
    await conn.close();
    process.exit(0);
  });

  return conn;
};

const MongooseTutorial = newConnection(
  process.env.URI_MongoDB_MongooseTutorial
);

module.exports = {
  mongooseTutorial: MongooseTutorial,
};
