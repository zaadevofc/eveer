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
    const data = await prisma.user.findFirst({
      where: { email: token.email },
    });

    if (!data)
      return res.status(405).json({ ok: false, message: "Email tidak valid!" });

    const add = await prisma.event.create({
      data: { ...exclude(token, ["email", "exp"]) },
    });

    if (add)
      return res
        .status(200)
        .json({ ok: true, message: "Event berhasil ditambahkan." });
  } catch (e) {
    console.log(e);
    return res
      .status(409)
      .json({ ok: false, message: `Nama event tidak boleh sama!` });
  }
};

export default handler;
