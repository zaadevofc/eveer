import {
  comparePassword,
  hashPassword,
  validateBody,
  validateMethod,
  validateToken,
} from "../../../../utils/tools";
import prisma from "../../../../prisma";

const handler = async (req, res) => {
  validateMethod(req, res, "POST");
  validateBody(req, res, ["token"]);
  let token = await validateToken(req, res, "body");
  let { email, old_password, new_password, confirm_new_password } = token;

  try {
    old_password = old_password.replace(/ /g, "");
    new_password = new_password.replace(/ /g, "");
    confirm_new_password = confirm_new_password.replace(/ /g, "");

    const data = await prisma.user.findFirst({
      where: { email },
    });

    if (!data)
      return res.status(405).json({ ok: false, message: "Email tidak valid!" });
    if (!(await comparePassword(old_password, data.password)))
      return res
        .status(405)
        .json({ ok: false, message: "Masukan password lama yang benar!" });
    if (new_password != confirm_new_password)
      return res
        .status(405)
        .json({ ok: false, message: "Konfirmasi password baru dengan benar!" });

    const newPass = await prisma.user.update({
      where: { email },
      data: { password: await hashPassword(confirm_new_password) },
    });

    if (newPass)
      return res
        .status(200)
        .json({ ok: true, message: "Berhasil mengubah password." });
  } catch (e) {
    console.log(e);
    return res
      .status(409)
      .json({ ok: false, message: `Gagal mengubah password!` });
  }
};

export default handler;
