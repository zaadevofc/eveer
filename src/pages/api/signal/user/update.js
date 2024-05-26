
import {
  exclude,
  validateBody,
  validateMethod,
  validateToken,
} from "../../../../utils/tools";
import prisma from "../../../../prisma";

const handler = async (req, res) => {
  validateMethod(req, res, "POST");
  validateBody(req, res, ["token"]);
  let token = await validateToken(req, res, "body");

  try {
    token = token.hasOwnProperty('username') ? { username: token.username?.replace(/ /g, ""), ...token } : token;
    const data = await prisma.user.update({
      where: { email: token.email },
      data: { ...exclude(token, ['exp', 'email', 'id', 'password']) },
    });
    if (data) return res.status(200).json({ ok: true, message: 'Berhasil mengubah info akun.' });
  } catch (e) {
    console.log(e);
    return res
      .status(409)
      .json({ ok: false, message: `Username sudah ada!` });
  }
};

export default handler;
