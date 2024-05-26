import {
  exclude,
  excludeList,
  validateBody,
  validateMethod,
  validateToken
} from "../../../../utils/tools";
import prisma from '../../../../prisma'

const handler = async (req, res) => {
  validateMethod(req, res, "POST");
  validateBody(req, res, ["token"]);
  await validateToken(req, res, "body");

  try {
    const data = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });
    if (data) return res
      .status(200)
      .json({ ok: true, data: excludeList(data, ["password"]) });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal mengambil list user!` });
  }
};

export default handler;
