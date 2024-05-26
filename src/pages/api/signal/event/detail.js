import {
  validateMethod,
  validateQuery
} from "../../../../utils/tools";
import prisma from "../../../../prisma";

const handler = async (req, res) => {
  validateMethod(req, res, "GET");
  validateQuery(req, res, ["name"]);

  try {
    const { name } = req.query;
    const data = await prisma.event.findFirst({
      where: { event_name: name.replace(/-/g, " ") },
    });
    
    if (data) return res.status(200).json({ ok: true, data });
    return res
      .status(404)
      .json({ ok: false, message: `Event tidak ditemukan!` });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal mengambil detail event!` });
  }
};

export default handler;
