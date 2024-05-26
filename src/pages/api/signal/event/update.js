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

    const up = await prisma.event.update({
      where: { id: token.id },
      data: { ...exclude(token, ["email", "exp", "id"]) },
    });

    if (up)
      return res
        .status(200)
        .json({ ok: true, message: "Event berhasil di perbarui." });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal memperbarui event!` });
  }
};

export default handler;
