const {Users} = require('../model/schemas');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bar.g555@gmail.com",
      pass: "fumj tjym ojnf butz",
    },
});

const handleNewUser = async (req, res) => {
  const {mail, password, first_name, last_name} = req.body;
  

  const duplicate = await Users.findOne({mail: mail});
  if(duplicate) return res.status(409).json({'error' : `User ${mail} is already exists`});

  try {
      const hasedPwd = await bcrypt.hash(password, 10);
      const confirmation = Math.floor(Math.random()* 10000 + 10000)
      const newUser = {'mail' : mail, 'password' : hasedPwd, 'confirmation_code' : confirmation, 'first_name' : first_name, 'last_name' : last_name};
      await Users.create(newUser);
      
      const mailOptions = {
          from: "bar.g555@gmail.com",
          to: mail,
          subject: "Confirmation code",
          text: `Your confirmation code is: ${confirmation}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email: ", error);
          } else {
            console.log("Email sent: ", info.response);
          }
      });

      res.status(201).json({'success' : `New User ${first_name} ${last_name} created!`})
  } catch (err) {
      res.status(500).json({'error': err.message});
  }
}

module.exports = {handleNewUser};
