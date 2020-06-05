const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const mail = require("../config/mail");

const ChangePassword = require("../Models/ChangePassword");
const User = require("../Models/User");
module.exports = {
  async create(req, res) {
    const { email } = req.body;
    const token = randomstring.generate(8);

    if (!(await User.findOne({ email }))) {
      return res.status(400).json({ error: "Email is not in database." });
    }

    if (await ChangePassword.findOne({ email })) {
      return res.status(400).json({ error: "You have already requested..." });
    }

    const { token: tkn } = await ChangePassword.create({
      email,
      token,
    });

    await mail.sendMail({
      from: '"Filehub" <hi@filehub.com>',
      to: email,
      subject: "Token to change your password",
      text: `Token: ${tkn}`,
    });

    return res.status(204).send();
  },

  async store(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    const data = await ChangePassword.findOne({ token });
    if (!data) {
      return res.status(400).json({
        error: "Token not found.",
      });
    }

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(400).json({
        error: "User not found.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    user.save();
    data.remove();

    return res.status(204).send();
  },
};
