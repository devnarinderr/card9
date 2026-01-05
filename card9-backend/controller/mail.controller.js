const crypto = require("crypto");
const dbConn = require("../db/conn");
const {
  API_URL,
  RECIPIENT_EMAIL,
} = require("../common/utilities/constants.js");
const transporter = require("../common/utilities/mailer"); //made util for mail
// Handle case where database models might not be available
const User = dbConn.user || null;

exports.contactLead = async (req, res) => {
  const { name, email, contact, price, message } = req.body;

  const mailOptions = {
    from: RECIPIENT_EMAIL,
    to: RECIPIENT_EMAIL, // Send to admin email
    subject: `New Lead from Card9 Landing Page - ${name}`,
    html: `
      <h2>New Lead Information</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Price Option:</strong> ${price}</p>
      <p><strong>Message:</strong> ${message || 'No message provided'}</p>
    `,
  };

  transporter
    .sendMail(mailOptions)
    .then((response) => {
      res.status(201).json({
        msg: "Lead information sent successfully!",
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        msg: "Failed to send lead information!",
        data: error,
      });
    });
};

exports.sendCard = async (req, res) => {
  const { email, cardImage, cardName } = req.body.emailData;

  const mailOptions = {
    from: RECIPIENT_EMAIL,
    to: email,
    subject: `Bussiness card from ${cardName}`,
    html: `<h1>By CARD9.me</h1>  
           <img style='width: "500px"; hight="600px"' src="cid:card.image"/>
          <h1>By CARD9.me</h1>  
    `,

    attachments: [
      {
        filename: cardName + ".jpeg",
        path: cardImage,
        cid: "card.image",
      },
    ],
  };
  transporter
    .sendMail(mailOptions)
    .then((response) => {
      res.status(201).json({
        msg: "Card  sent successfully!!",
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        msg: "Card mail sent Failed!!",
        data: error,
      });
    });
};

exports.supportMail = async (req, res) => {
  const { name, email, message, subject } = req.body.emailData;

  const mailOptions = {
    from: RECIPIENT_EMAIL,
    to: `simarpreets@evolvan.com`,
    subject: subject,
    html: `You got a message from
      Email : ${email}
      Message: ${message}`,
  };
  transporter
    .sendMail(mailOptions)
    .then((response) => {
      res.status(201).json({
        msg: "Support mail sent successfully!!",
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        msg: "Support mail sent Failed!!",
        data: error,
      });
    });
};

exports.feedbackMail = async (req, res) => {
  const { name, email, message, subject, rating } = req.body.emailData;

  const mailOptions = {
    from: RECIPIENT_EMAIL,
    to: `simarpreets@evolvan.com`,
    subject: subject,
    html: `You got a message from
    Email : ${email}
    Rating : ${rating}
    Message: ${message}`,
  };
  transporter
    .sendMail(mailOptions)
    .then((response) => {
      res.status(201).json({
        msg: "Feedback sent successfully!!",
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        msg: "Feedback sent Failed!!",
        data: error,
      });
    });
};

exports.resetPassword = (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Password reset temporarily disabled.",
    });
  }
  
  randomToken = crypto.randomBytes(5).toString("hex");

  const mailOptions = {
    from: RECIPIENT_EMAIL,
    to: req.body.email,
    subject: "Password Reset",
    html: `You got a message from
      Email : ${req.body.email}
      Message: <a href="${API_URL}/reset-password/${randomToken}">Reset Password</a>`,
  };

  User.update(
    { resetToken: randomToken },
    { where: { id: req.params.id } }
  ).then((response) => {});

  transporter
    .sendMail(mailOptions)
    .then((response) => {
      res.status(201).json({
        msg: "Support mail sent successfully!!",
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        msg: "Support mail sent Failed!!",
        data: error,
      });
    });
};

exports.forgotPassword = (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Password recovery temporarily disabled.",
    });
  }
  
  randomToken = crypto.randomBytes(5).toString("hex");

  const mailOptions = {
    from: RECIPIENT_EMAIL,
    to: req.body.email,
    subject: "Password Reset",
    html: `You got a message from
      Email : ${req.body.email}
      Message: <a href="${API_URL}/reset-password/${randomToken}">Reset Password</a>`,
  };

  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      user.update(
        { resetToken: randomToken },
        { where: { email: req.body.email } }
      );
    })
    .catch((err) => {
      console.log(err);
    });

  User.update(
    { resetToken: randomToken },
    { where: { email: req.params.email } }
  )
    .then((response) => {
    })
    .catch((err) => {
      console.log(err);
    });
  transporter
    .sendMail(mailOptions)
    .then((response) => {
      res.status(201).json({
        msg: "ResetPassword mail sent successfully!!",
        data: response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        msg: "ResetPassword mail sent Failed!!",
        data: error,
      });
    });
};