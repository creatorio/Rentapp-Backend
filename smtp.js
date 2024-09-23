const nodemailer = require("nodemailer");
const send = (mailOptions) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rent.manager.corp@gmail.com",
      pass: "ljll myiy mube itmh",
    },
  });
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { send };
