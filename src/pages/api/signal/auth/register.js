import prisma from "../../../../prisma";
import {
  validateBody,
  validateMethod,
  validateToken,
} from "../../../../utils/tools";

const handler = async (req, res) => {
  validateMethod(req, res, "POST");
  validateBody(req, res, ["token"]);
  let token = await validateToken(req, res, "body");

  try {
    const add = await prisma.user.create({
      data: {
        username: token.username,
        email: token.email,
        password: token.password,
      },
    }, 10);
    return res.status(200).json({ ok: true, message: "Berhasil mendaftarkan akun!" });
  } catch (e) {
    console.log(e);
    return res
      .status(409)
      .json({ ok: false, message: `Data username/email sudah terdaftar!` });
  }
};

export default handler;
