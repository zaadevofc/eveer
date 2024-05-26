import prisma from "../../../../prisma";
import {
  validateMethod
} from "../../../../utils/tools";

const handler = async (req, res) => {
  validateMethod(req, res, "GET");

  try {
    const data = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
    if (data) return res.status(200).json({ ok: true, data: data.reverse() });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal mengambil list event!` });
  }
};

export default handler;
