const dbConn = require("../db/conn");
const transporter = require("../common/utilities/mailer");
const { RECIPIENT_EMAIL } = require("../common/utilities/constants.js");
const User = dbConn.user;

exports.sendRegistrationEndingMail_30 = () => {
  User.findAll().then((users) => {
    users.forEach((user, index) => {
      const registrationDate = new Date(user.createdAt);
      const oneYearLater = new Date(
        registrationDate.getFullYear() + 1,
        registrationDate.getMonth(),
        registrationDate.getDate()
      );
      const thirtyDaysBefore = new Date(
        oneYearLater.getTime() - 30 * 24 * 60 * 60 * 1000
      );
      const today = new Date();

      const fullName = user.first_name + " " + user.last_name;
      const emailSentOn = user.emailSent;

      const time = new Date(emailSentOn).getTime() - thirtyDaysBefore.getTime();
      const timeDiff = time / (1000 * 3600 * 24);
      const daysDiff = Math.ceil(timeDiff);

      if (emailSentOn !== null && daysDiff <= 30) {
        return;
      } else {
        if (today >= thirtyDaysBefore && today <= oneYearLater) {
          let mailOptions = {
            from: `"Card9.me" <${RECIPIENT_EMAIL}>`,
            to: user.email,
            subject: "One-year anniversary approaching in 30 days",
            text: `Dear ${fullName}, your one-year anniversary is approaching on ${oneYearLater.toDateString()}.`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              user
                .update({ emailSent: new Date() }, { where: { id: user.id } })
                .then((response) => {
                  console.log(`Email sent to ${user.email}: ` + info.response);
                });
            }
          });
        }
      }
    });
  });
};

exports.sendRegistrationEndingMail_7 = () => {
  User.findAll().then((users) => {
    users.forEach((user, index) => {
      const registrationDate = new Date(user.createdAt);
      const oneYearLater = new Date(
        registrationDate.getFullYear() + 1,
        registrationDate.getMonth(),
        registrationDate.getDate()
      );
      const sevenDaysBefore = new Date(
        oneYearLater.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      const today = new Date();
      const fullName = user.first_name + " " + user.last_name;

      const emailSentOn = user.emailSent;

      const timeDiff =
        new Date(emailSentOn).getTime() - sevenDaysBefore.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (emailSentOn !== null && daysDiff <= 7) {
        return;
      } else {
        if (today >= sevenDaysBefore && today <= oneYearLater) {
          let mailOptions = {
            from: `"Card9.me" <${RECIPIENT_EMAIL}>`,
            to: user.email,
            subject: "One-year anniversary approaching in 7 days",
            text: `Dear ${fullName}, your one-year anniversary is approaching on ${oneYearLater.toDateString()}.`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              user
                .update({ emailSent: new Date() }, { where: { id: user.id } })
                .then((response) => {
                  console.log(`Email sent to ${user.email}: ` + info.response);
                });
            }
          });
        }
      }
    });
  });
};
