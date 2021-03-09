const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const config = require('./client/src/Config.js');

const accessKeyId = config.accessKeyId;
const secretAccessKey = config.secretAccessKey;
const authorization = config.authorization;

const caver = config.caver;

// app.get('/api/hello', (req, res) => {
//     res.send({message: 'Hello Express!'});
// })

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  databsase: conf.database,
});

connection.connect();

const multer = require("multer");
const upload = multer({ dest: "./upload" });

app.get("/api/products", (req, res) => {
  connection.query(
    "SELECT * FROM TEST.PRODUCT WHERE isDeleted = 0",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/products/:id", (req, res) => {
  console.log("req.params.id", req.params.id);
  connection.query(
    "SELECT name, image FROM TEST.PRODUCT AS P JOIN TEST.RECEIPT AS R ON P.id = R.productID where R.tokenID=? and P.isDeleted = 0",
    req.params.id,
    (err, rows, fields) => {
      console.log(rows);
      res.send(rows);
    }
  );
});

app.get("/api/receipts/:id", (req, res) => {
  console.log("get /api/receipts");
  connection.query(
    "SELECT * FROM TEST.PRODUCT WHERE isDeleted = 0 AND id = ?",
    req.params.id,
    async (err, rows, fields) => {
      if (rows.length == 0) {
        res.send("{}");
        return;
      }

      contractAddr = rows[0]["contractAddr"];

      var options = {
        method: "GET",
        url:
          "https://th-api.klaytnapi.com/v2/contract/nft/" + contractAddr + "/token",
        headers: {
          "x-Chain-ID": 1001,
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);

        items = response.body["items"];
        if (!items) {
          res.send(response.body);
          return;
        }

        items.map((contract) => {});
      });
    }
  );
});

app.get("/api/customers/:addr", (req, res) => {
  console.log("get /api/customers/:addr", req.params.addr);
  connection.query(
    "SELECT * FROM TEST.RECEIPT WHERE isDeleted = 0 and LOWER(toAddr) like CONCAT('%',LOWER(?),'%');",
    req.params.addr,
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.get("/api/sellers", (req, res) => {
  connection.query(
    "SELECT * FROM TEST.SELLER WHERE isDeleted = 0",
    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.use("/image", express.static("./upload")); // 맵핑이 됨.

// 컨트랙트(=상품) 추가
app.post("/api/products", upload.single("image"), async (req, res) => {
  console.log("post /api/products");
  console.log(
    "name",
    req.body.name,
    "symbol",
    req.body.symbol,
    "sellerPrivateKey",
    req.body.sellerPrivateKey
  );

  const keyring = caver.wallet.keyring.createFromPrivateKey(
    req.body.sellerPrivateKey
  );

  if (!caver.wallet.getKeyring(keyring.address)) {
    const singleKeyRing = caver.wallet.keyring.createFromPrivateKey(
      req.body.sellerPrivateKey
    );
    caver.wallet.add(singleKeyRing);
  }
  const kip17 = await caver.kct.kip17.deploy(
    {
      name: req.body.name,
      symbol: req.body.symbol,
    },
    keyring.address
  );
  // .then((kip17) => console.log(kip17.options.address));
  console.log(kip17.options.address);

  let sql =
    "INSERT INTO TEST.PRODUCT (name, symbol, contractAddr, image, registeredDate, isDeleted) VALUES (?, ?, ?, ?, now(), 0)";
  console.log(req.file);
  let image = "/image/" + req.file.filename;
  let name = req.body.name;
  let symbol = req.body.symbol;

  let params = [name, symbol, kip17.options.address, image];

  console.log("insert params: " + params);

  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
    console.log(err);
  });

  console.log("end of /api/products post");
});

app.delete("/api/products/:id", (req, res) => {
  console.log("received product delete request");
  let sql = "UPDATE TEST.PRODUCT SET isDeleted = 1 WHERE id = ?";
  let params = [req.params.id];
  console.log(params);
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

// 토큰(=영수증) 발행
app.post("/api/receipts", async (req, res) => {
  console.log("post /api/receipts");
  console.log("req.body.sellerPrivateKey: " + req.body.sellerPrivateKey);
  console.log("req.body.productID: " + req.body.productID);
  console.log("req.body.toAddr: " + req.body.toAddr);

  const keyring = caver.wallet.keyring.createFromPrivateKey(
    req.body.sellerPrivateKey
  );

  if (!caver.wallet.getKeyring(keyring.address)) {
    const singleKeyRing = caver.wallet.keyring.createFromPrivateKey(
      req.body.sellerPrivateKey
    );
    caver.wallet.add(singleKeyRing);
  }

  connection.query(
    "SELECT * FROM TEST.PRODUCT WHERE isDeleted = 0 AND id = ?",
    req.body.productID,
    async (err, rows, fields) => {
      console.log("keyring.address", keyring.address);
      console.log("contractAddr", rows[0]["contractAddr"]);

      contractAddr = rows[0]["contractAddr"];

      const kip17 = new caver.kct.kip17(contractAddr);

      minted = false;
      while (true) {
        randomID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        console.log("randomID", randomID);
        try {
          owner = await kip17.ownerOf(randomID);
        } catch (e) {
          console.log("we can mint");

          tokenURI = JSON.stringify({
            sellerID: 0,
            productID: req.body.productID,
          });
          mintResult = await kip17.mintWithTokenURI(
            req.body.toAddr,
            randomID,
            tokenURI,
            { from: keyring.address }
          );

          let sql =
            "INSERT INTO TEST.RECEIPT " +
            "(sellerID, productID, tokenID, tokenURI, contractAddr, fromAddr, toAddr, registeredDate, lastUpdatedDate, isDeleted)" +
            " VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)";

          let params = [
            0,
            req.body.productID,
            randomID,
            tokenURI,
            contractAddr,
            "0x0000000000000000000000000000000000000000",
            req.body.toAddr,
          ];

          connection.query(sql, params, (err, rows, fields) => {
            if (!err) {
              console.log("error while inserting a new receipt", "err", err);
            }
          });

          minted = true;
          console.log("mintResult", mintResult);
          //console.error(e);
        }

        if (minted) {
          break;
        }
      }
      res.send(rows);
    }
  );
  console.log("end of /api/products post");
});

app.post("/api/receipts/send", async (req, res) => {
  console.log("post /api/receipts");
  console.log("req.body.customerPrivateKey: " + req.body.customerPrivateKey);
  console.log("req.body.contractAddr: " + req.body.contractAddr);
  console.log("req.body.tokenId: " + req.body.tokenId);
  console.log("receiverAddr", req.body.receiverAddr);

  let senderPrivateKey = req.body.customerPrivateKey;

  // customer private key import
  const senderKeyring = caver.wallet.keyring.createFromPrivateKey(
    senderPrivateKey
  );

  if (!caver.wallet.getKeyring(senderKeyring.address)) {
    const singleKeyRing = caver.wallet.keyring.createFromPrivateKey(
      senderPrivateKey
    );
    caver.wallet.add(singleKeyRing);
  }
  let contractAddr = req.body.contractAddr;

  connection.query(
    "UPDATE TEST.RECEIPT SET fromAddr = ?, toAddr = ?, lastUpdatedDate=NOW() WHERE contractAddr=? AND tokenID=?",
    [
      senderKeyring.address,
      req.body.receiverAddr,
      contractAddr,
      req.body.tokenId,
    ],
    async (err, rows, fields) => {
      const kip17 = new caver.kct.kip17(contractAddr);

      console.log(`senderKeyring.address: ${senderKeyring.address}`);
      console.log(`req.body.receiverAddr: ${req.body.receiverAddr}`);
      console.log(`req.body.tokenId: ${typeof req.body.tokenId}`);

      console.log(caver.currentProvider);
      transferResult = await kip17.transferFrom(
        senderKeyring.address,
        req.body.receiverAddr,
        req.body.tokenId,
        { from: senderKeyring.address, gas: 200000 }
      );
      console.log(transferResult);
      res.send(transferResult);
    }
  );
});

app.delete("/api/products/:id", (req, res) => {
  console.log("received delete request");
  let sql = "UPDATE TEST.PRODUCT SET isDeleted = 1 WHERE id = ?";
  let params = [req.params.id];
  console.log(params);
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.get("/api/klay/blocknumber", async (req, res) => {
  bb = await getBlockNumber();
  console.log("bb: " + bb);
  res.send({ blockNumber: bb });
});

app.get("/api/klay/balance/:addr", async (req, res) => {
  console.log(req.params.addr);
  b = await getBalance(req.params.addr);
  console.log("balance: " + b);
  res.send({ balance: b });
});

async function getBlockNumber() {
  hexBlockNumber = await caver.rpc.klay.getBlockNumber();
  decBlockNumber = parseInt(hexBlockNumber, 16);
  return decBlockNumber;
}

async function getBalance(addr) {
  hexBalance = await caver.rpc.klay.getBalance(addr);
  decBalance = parseInt(hexBalance, 16);
  return decBalance;
}

async function getAddress(sellerID) {}

let kasWalletHeader = {
  Authorization:
    "Basic " +
    Buffer.from(accessKeyId + ":" + secretAccessKey).toString("base64"),
  "x-krn": "krn:1001:wallet:114:account:default",
};

let request = require("request");

app.get("/api/kas/wallet/newaccount", async (req, res) => {
  console.log("/api/kas/wallet/newaccount");
  newAccount = await createAccount();
  console.log("newAccount: " + newAccount);
  res.send({ address: newAccount["result"]["address"] });
});

async function createAccount() {
  var options = {
    url: "https://wallet-api.beta.klaytn.io/v2/account",
    headers: kasWalletHeader,
    method: "POST",
    auth: {
      user: accessKeyId,
      pass: secretAccessKey,
    },
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      return body;
    } else {
      console.log(
        "error: " + error + ", statusCode: " + response.StatusCode,
        ", response: " + response
      );
    }
  }

  request(options, callback);
}

async function getAccount() {
  var options = {
    url: "https://wallet-api.beta.klaytn.io/v2/account",
    headers: kasWalletHeader,
    method: "GET",
    body: JSON.stringify({
      address: "0xA11D5096BB4a1467Fe16D2a90222e6144eB35476",
    }),
    auth: {
      user: accessKeyId,
      pass: secretAccessKey,
    },
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.log("error: " + error + ", response: " + response);
    }
  }

  request(options, callback);
}

app.listen(port, () => console.log(`Listening on port ${port}`));
