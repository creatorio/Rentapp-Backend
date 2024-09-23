const { send } = require("./smtp");
const { Worker } = require("worker_threads");
const express = require("express");
const cors = require("cors");
const app = express();
const webPush = require("web-push");
const bodyParser = require("body-parser");
var timeandsub;
const {
  symmetricCrypto,
  asymmetricCrypto,
  keyAgreementCrypto,
} = require("./mute-crypto-helper.browser.es2015.esm");
asymmetricCrypto.generateEncryptionKeyPair();
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Initialize web-push with your VAPID keys
const publicKey =
  "BMG1_Cwy8C_JRweiURMlkCiYsdmfzzMfjt_fPk1QOUGBdssQJGpuy2rmrSobDQ0ZztHAzFzfNDTn34n_3QmroGM";
const privateKey = "HVhYwI44ir7BnODaEUBIhudiBaKqyZOezMqxFiSZRzs";
webPush.setVapidDetails(
  "mailto: <rdjunior018@gmail.com>",
  publicKey,
  privateKey
);
const worker = new Worker("./worker.js");
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  if (!req.body.paid) {
    timeandsub = {
      tenant: req.body.tenant,
      sub: req.body.sub,
      day: req.body.day,
      month: req.body.month,
      payload: req.body.notif,
    };
    worker.postMessage(timeandsub);
    // Send 201 - resource created
    res.send("Sent");
  }
  if (req.body.paid) {
    worker.postMessage(req.body);
    res.send("Sent");
  }
});
worker.on("message", (e) => {
  if (!e.condition) {
    console.log(e + " ");
  } else if (e.condition) {
    setTimeout(() => {
      webPush
        .sendNotification(e.sub, e.payload)
        .catch((err) => console.error(err));
    }, 5000);
    console.log("sent");
  }
});
var mailOptions = {
  from: "rent.manager.corp@gmail.com",
  to: "rdjunior018@gmail.com",
  subject: "Sending Email using Node.js",
  text: `This is a verification email from Rent Manager. Here is your code : `,
};

app.post("/verify", function (req, res) {
  console.log(req.body);
  if (req.body.typemail == "verify") {
    mailOptions.subject = req.body.subject;
    mailOptions.to = req.body.to;
    mailOptions.text = `This is a verification email from Rent Manager. Here is your code : ${req.body.code} `;
    send(mailOptions);
    res.send("Sent");
  }
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
