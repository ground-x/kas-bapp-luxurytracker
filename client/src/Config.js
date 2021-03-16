const accessKeyId = "YOUR_ACCESS_KEY_ID_FROM_KAS_CONSOLE";
const secretAccessKey = "YOUR_SECRET_ACCESS_KEY_FROM_KAS_CONSOLE";
const authorization = "Basic " + Buffer.from(accessKeyId + ":" + secretAccessKey).toString("base64")

const option = {
  headers: [
    {
      name: "Authorization",
      value: authorization,
    },
    { name: "x-krn", value: "krn:1001:node" },
  ],
};

const Caver = require("caver-js");
const caver = new Caver(
  new Caver.providers.HttpProvider(
    "https://node-api.klaytnapi.com/v1/klaytn",
    option
  )
);

module.exports = {accessKeyId, secretAccessKey, authorization, caver}