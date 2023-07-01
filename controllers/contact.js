import nodemailer from "nodemailer";

export const contact = async (req, res) => {
  try {
    const { email, name, message } = req.body;

    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: "eduvilla.org@gmail.com",
        pass: "jqonbwejnyblsztv",
      },
    });

    var mailOptions = {
      from: "eduvilla.org@gmail.com",
      to: "abhi9936413991@gmail.com,dadzheromani@gmail.com",
      subject: name + " - Sent a message",
      html: `<h2>Edu-Villa Team,</h2><br /><h3 style="font-size:17px;">We have received a message from ${name} (${email})</h3></br><div style="font-size:18px;"><span style="font-weight:600;">Message from ${name} : </span> ${message}</div>`,
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.log(error);
        res.status(404).send("Error Unable to send mail");
      } else {
        res.status(200).send("Mail sent");
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};
