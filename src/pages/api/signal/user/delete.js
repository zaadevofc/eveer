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

    const del = await prisma.user.delete({
      where: { id: token.id },
    });

    if (del)
      return res
        .status(200)
        .json({ ok: true, message: "User berhasil di hapus." });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal menghapus user!` });
  }
};

export default handler;
