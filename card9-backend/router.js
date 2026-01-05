const express = require("express");
const router = express.Router();
// const db = require("./dbConnection");
const { signupValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", signupValidation, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO users (first_name,last_name,email,password) VALUES ('${
                req.body.firstName
              }','${req.body.lastName}', ${db.escape(
                req.body.email
              )}, ${db.escape(hash)})`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err,
                  });
                }
                return res.status(201).send({
                  msg: "The user has been registerd with us!",
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post("/saveCard", (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        // username is available
        // bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            msg: err,
          });
        } else {
          // has hashed pw => add to database
          db.query(
            `INSERT INTO users_file (cardname,profileimage,logo,prefix,first_name,middle_name,last_name,suffix,accreditation,preferredName,maidenName,pronouns,title,department,company,headline,email,address,website,link,instagram,twitter,linkedin,snapchat,github,youtube) VALUES ('${
              req.body.cardname
            }','${req.body.profileimage}', ${db.escape(
              req.body.logo
            )}, ${db.escape(req.body.prefix)},${db.escape(
              req.body.first_name
            )},${db.escape(req.body.middle_name)},${db.escape(
              req.body.last_name
            )},${db.escape(req.body.suffix)},${db.escape(
              req.body.accreditation
            )},${db.escape(req.body.preferredName)},${db.escape(
              req.body.maidenName
            )},${db.escape(req.body.pronouns)},${db.escape(
              req.body.title
            )},${db.escape(req.body.department)},${db.escape(
              req.body.company
            )}, ${db.escape(req.body.headline)},${db.escape(
              req.body.email
            )},${db.escape(req.body.address)},${db.escape(
              req.body.website
            )},${db.escape(req.body.link)},${db.escape(
              req.body.instagram
            )},${db.escape(req.body.twitter)},${db.escape(
              req.body.linkedin
            )},${db.escape(req.body.snapchat)},${db.escape(
              req.body.github
            )},${db.escape(req.body.youtube)})`,
            (err, result) => {
              if (err) {
                throw err;
                return res.status(400).send({
                  msg: err,
                });
              }
              return res.status(201).send({
                msg: "Card has been",
              });
            }
          );
        }
        // });
      }
    }
  );
});

router.post("/login", loginValidation, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: "Email or password is incorrect!",
        });
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: "Email or password is incorrect!",
            });
          }
          if (bResult) {
            const token = jwt.sign(
              { id: result[0].id },
              "the-super-strong-secrect",
              { expiresIn: "1h" }
            );
            // console.log(token);
            //   db.query(
            //     `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
            //   );
            return res.status(200).send({
              msg: "Logged in!",
              token,
              user: result[0],
            });
          }
          return res.status(401).send({
            msg: "Username or password is incorrect!",
          });
        }
      );
    }
  );
});

router.post("/update-password", function (req, res, next) {
  var email = req.body.email;
  console.log(email);
  var password = req.body.password;
  db.query(
    'SELECT * FROM users WHERE email ="' + email + '"',
    function (err, result) {
      if (err) throw err;
      var type;
      var msg;
      if (result.length > 0) {
        var saltRounds = 10;
        // var hash = bcrypt.hash(password, saltRounds);
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            var data = {
              password: hash,
            };
            db.query(
              'UPDATE users SET ? WHERE email ="' + result[0].email + '"',
              data,
              function (err, result) {
                if (err) throw err;
              }
            );
          });
        });
        type = "success";
        msg = "Your password has been updated successfully";
      } else {
        console.log("2");
        type = "success";
        msg = "Invalid link; please try again";
      }
      // req.flash(type, msg);
      res.send("password changed");
    }
  );
});

router.post("/update-email", function (req, res, next) {
  var id = req.body.id;
  var emailz = req.body.email;
  db.query(
    'SELECT * FROM users WHERE id ="' + id + '"',
    function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        var data = {
          email: emailz,
        };
        db.query(
          'UPDATE users SET ? WHERE id ="' + result[0].id + '"',
          data,
          function (err1, result1) {
            if (err1) throw err1;
            if (result1.affectedRows === 1) {
              db.query(
                'SELECT * FROM users WHERE id ="' + id + '"',
                function (err, result) {
                  if (err) throw err;
                  return res.status(200).send({
                    msg: "Email has been updated.",
                    user: result[0],
                  });
                }
              );
            }
          }
        );
        1;
      } else {
        console.log(err);
        res.status(400).send("Error while updating email.");
        msg = "Invalid link; please try again";
      }
    }
  );
});

router.post("/DeleteUser", function (req, res, next) {
  var id = req.body.id;
  var emailz = req.body.email;
  db.query(
    'SELECT * FROM users WHERE id ="' + id + '"',
    function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        var data = {
          email: emailz,
        };
        db.query(
          'DELETE FROM users WHERE id ="' + result[0].id + '"',
          data,
          function (err, result) {
            if (err) throw err;
          }
        );
        res.send("Data has been deleted");
      } else {
        res.status(404).send("Data has not been deleted");
        type = "success";
        msg = "Invalid link; please try again";
      }
    }
  );
});

router.get("/edit/:id", function (req, res) {
  db.query(
    "select * from users_file where id=?",
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});

router.post("/edit/:id", function (req, res, next) {
  var id = req.params.id;
  var updateData = req.body;
  var sql = `UPDATE users_file SET ? WHERE id = ?`;
  db.query(sql, [updateData, id], function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
  });
  res.send("user updated");
});

router.post("/saveUserCard", (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        // username is available
        // bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            msg: err,
          });
        } else {
          // has hashed pw => add to database
          db.query(
            `INSERT INTO user_users_file (name,email,mailto,designation,telephone,whatsapp,linkedin,linkedinurl,fb,fburl,organization,img,logo,color,label,textlabel,youtubeid,urls,skypeurl,skypeid,instagramid,instagramurl,websiteid,websiteurl,twitterid,twitterurl,pdfid,pdfurl,addressid,addressurl,linkid,linkurl,yotubeattachment,telegramid,telegramurl,snapchatid,snapchaturl,pinterestid,pinteresturl,vimeoid,vimeourl,signalid,signalurl,notes) VALUES ('${
              req.body.name
            }','${req.body.email}',${db.escape(req.body.mailto)},${db.escape(
              req.body.designation
            )},${db.escape(req.body.telephone)},${db.escape(
              req.body.whatsapp
            )},${db.escape(req.body.linkedin)},${db.escape(
              req.body.linkedinurl
            )},${db.escape(req.body.fb)},${db.escape(
              req.body.fburl
            )},${db.escape(req.body.organization)},${db.escape(
              req.body.img
            )},${db.escape(req.body.logo)},${db.escape(
              req.body.color
            )},${db.escape(req.body.label)}, ${db.escape(
              req.body.textlabel
            )},${db.escape(req.body.youtubeid)},${db.escape(
              req.body.urls
            )},${db.escape(req.body.skypeurl)},${db.escape(
              req.body.skypeid
            )},${db.escape(req.body.instagramid)},${db.escape(
              req.body.instagramurl
            )},${db.escape(req.body.websiteid)},${db.escape(
              req.body.websiteurl
            )},${db.escape(req.body.twitterid)},${db.escape(
              req.body.twitterurl
            )},${db.escape(req.body.pdfid)},${db.escape(
              req.body.pdfurl
            )},${db.escape(req.body.addressid)},${db.escape(
              req.body.addressurl
            )},${db.escape(req.body.linkid)},${db.escape(
              req.body.linkurl
            )},${db.escape(req.body.yotubeattachment)},${db.escape(
              req.body.yotubeattachment
            )},${db.escape(req.body.telegramid)},${db.escape(
              req.body.telegramurl
            )},${db.escape(req.body.snapchatid)},${db.escape(
              req.body.snapchaturl
            )},${db.escape(req.body.pinterestid)},${db.escape(
              req.body.pinteresturl
            )},${db.escape(req.body.vimeoid)},${db.escape(
              req.body.vimeourl
            )},${db.escape(req.body.signalid)},${db.escape(
              req.body.signalurl
            )},${db.escape(req.body.notes)})`,
            (err, result) => {
              if (err) {
                throw err;
                return res.status(400).send({
                  msg: err,
                });
              }
              return res.status(201).send({
                msg: "Card has been",
              });
            }
          );
        }
        // });
      }
    }
  );
});

router.get("/getUserCard/:id", function (req, res) {
  db.query(
    "select * from user_users_file where id=?",
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});

router.get("/getUserCards", function (req, res) {
  db.query("select * from user_users_file", function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

router.post("/saveImage", (req, res, next) => {
  db.query(
    `SELECT * FROM users_file WHERE LOWER(id) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        // username is available
        // bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({
            msg: err,
          });
        } else {
          // has hashed pw => add to database
          db.query(
            `INSERT INTO users_file (file_src) VALUES ('${req.body.file_src}')`,
            (err, result) => {
              if (err) {
                throw err;
                return res.status(400).send({
                  msg: err,
                });
              }
              return res.status(201).send({
                msg: "img  has been saved",
              });
            }
          );
        }
        // });
      }
    }
  );
});

router.post("/DeleteCard", function (req, res, next) {
  var id = req.body.id;
  var emailz = req.body.email;
  db.query('SELECT * FROM user_cards WHERE id ="' + id + '"', function (err) {
    if (err) throw err;
    if (result.length > 0) {
      var data = {
        email: emailz,
      };
      db.query(
        'DELETE FROM user_cards WHERE id ="' + result[0].id + '"',
        data,
        function (err, result) {
          if (err) throw err;
        }
      );
    } else {
      console.log("2");
      type = "success";
      msg = "Invalid link; please try again";
    }
    res.send("card has been deleted");
  });
});

module.exports = router;
