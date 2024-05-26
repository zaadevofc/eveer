import prisma from "../../../../prisma";
import {
  validateBody,
  validateMethod,
  validateToken
} from "../../../../utils/tools";

const handler = async (req, res) => {
  validateMethod(req, res, "POST");
  validateBody(req, res, ["token"]);
  let token = await validateToken(req, res, "body");

  try {
    const { force } = req.query;
    const data = await prisma.user.findFirst({
      where: { email: token.email },
    });

    if (!data)
      return res.status(405).json({ ok: false, message: "Email tidak valid!" });

    if (force == "1") {
      const inc = await prisma.income.delete({
        where: { income_target_id: token.id },
      });
      const del = await prisma.event.delete({
        where: { id: token.id },
      });

      if (inc && del)
        return res
          .status(200)
          .json({ ok: true, message: "Event berhasil di hapus." });
    }

    const del = await prisma.event.delete({ where: { id: token.id } });
    if (del)
      return res
        .status(200)
        .json({ ok: true, message: "Event berhasil di hapus." });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal menghapus event!` });
  }
};

export default handler;
