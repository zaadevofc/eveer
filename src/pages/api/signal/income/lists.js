import { validateMethod } from "../../../../utils/tools";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  validateMethod(req, res, "GET");

  try {
    const data = await prisma.income.findMany({
      orderBy: { createdAt: "desc" },
      include: { income_target: true },
    });
    if (data) return res.status(200).json({ ok: true, data: data.reverse() });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ ok: false, message: `Gagal mengambil list income!` });
  }
};

export default handler;
