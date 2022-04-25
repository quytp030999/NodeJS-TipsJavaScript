const redis = require("redis");

const client = redis.createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

client
  .connect()
  .then(() => {
    console.log("PONG");
  })
  .catch((error) => {
    console.log("error", error);
  });

client.on("error", function (error) {
  console.log("error", error);
});

client.on("connect", function () {
  console.log("connected");
});

client.on("ready", function () {
  console.log("ready");
});

module.exports = client;
