import prisma from "../../../../prisma";
import {
  validateMethod
} from "../../../../utils/tools";

const handler = async (req, res) => {
  validateMethod(req, res, "GET");

  try {
    const [event_total, event_finish, user_total] = await prisma.$transaction(
      [
        prisma.event.count(),
        prisma.event.count({
          where: { event_status: "FINISH" },
        }),
        prisma.user.count(),
      ]
    );

    let data = { event_total, event_finish, user_total };
    if (data) return res.status(200).json({ ok: true, data });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal mengambil list event!` });
  }
};

export default handler;
