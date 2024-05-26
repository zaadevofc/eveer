export { default } from "next-auth/middleware";
import { NextResponse } from "next/server";

const secure = ["/dashboard*"];
const notAccess = ["/auth*"];

export async function middleware(req) {
  const redirect = (uri) => NextResponse.redirect(new URL(uri, req.url));
  const session = await req.cookies.get("eveer-passport.session-token")?.value;
  const pathname = req.nextUrl.pathname;
  const isSecure = secure.some((path) =>
    path.endsWith("*")
      ? pathname.startsWith(path.slice(0, -1))
      : path == pathname
  );
  const isNotAccess = notAccess.some((path) =>
    path.endsWith("*")
      ? pathname.startsWith(path.slice(0, -1))
      : path == pathname
  );

  if (session) {
    if (isNotAccess) return redirect("/");
  } else {
    if (isSecure) return redirect("/");
  }
}
