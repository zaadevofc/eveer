import { createClient } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import bcrypt from "bcryptjs";
import DayJS from "dayjs";
import "dayjs/locale/id";
import FormData from "form-data";
import { sign, verify } from "hono/jwt";
import KeyGen from "keygen";
import QuickLRU from "quick-lru";

DayJS.locale("id");
export const dayjs = DayJS;
export const keygen = KeyGen;

export const cache = new QuickLRU({ maxSize: 1000 });

export const checkLengthValue = (obj, inputLength = 1, textLength = 6) => {
  if (Object.keys(obj).length != inputLength) return false;
  return Object.values(obj).every((x) => x.length > textLength - 1);
};

export const customObj = (obj, keys) =>
  keys.reduce((x, key) => {
    if (key in obj) {
      x[key] = obj[key];
    }
    return x;
  }, {});

export const stringObj = (arr) => JSON.stringify(arr);

export const validateQuery = (req, res, qs = []) => {
  if (stringObj(qs) == stringObj(Object.keys(req.query))) return false;
  return res
    .status(400)
    .json({ ok: false, message: `Parameter [${qs}] cannot empty` });
};

export const validateBody = (req, res, qs = []) => {
  if (stringObj(qs) == stringObj(Object.keys(req.body))) return false;
  return res
    .status(400)
    .json({ ok: false, message: `Parameter [${qs}] cannot empty` });
};

export const validateMethod = (req, res, method) => {
  if (req.method == method) return false;
  return res
    .status(405)
    .json({ ok: false, message: `Method "${req.method}" not allowed` });
};

export const validateToken = async (req, res, type) => {
  const v = await verifyJWT(req[type].token);
  if (!!v) return v;
  return res.status(403).json({ ok: false, message: `Invalid token` });
};

export const signJWT = async (payload = {}, exp = 50) => {
  try {
    return await sign(
      { ...payload, exp: Math.floor(Date.now() / 1000) + exp },
      "wkkwkwkwkwkwk",
      "HS512"
    );
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const verifyJWT = async (token) => {
  try {
    return await verify(token, "wkkwkwkwkwkwk", "HS512");
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const hashPassword = async (pass) =>
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(pass, salt))
    .then((hash) => hash)
    .catch((err) => false);

export const comparePassword = async (pass, hash) =>
  bcrypt
    .compare(pass, hash)
    .then((res) => res)
    .catch((err) => false);

export const exclude = (obj, keys) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );

export function excludeList(obj, keys) {
  return obj.map((obj) => exclude(obj, keys));
}

export const toRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));

export const statusColor = (status) =>
  ({
    PENDING: "bg-amber-100 text-amber-600",
    PROGRESS: "bg-sky-100 text-sky-600",
    FINISH: "bg-teal-100 text-teal-600",
    USER: "bg-zinc-100 text-zinc-600",
    PANITIA: "bg-emerald-100 text-emerald-600",
    ADMIN: "bg-purple-100 text-purple-600",
  }[status]);

export const statusDisplay = (status) =>
  ({
    PENDING: "Segera Mulai",
    PROGRESS: "Sedang di Mulai",
    FINISH: "Event Berakhir",
  }[status]);

export const parseForm = (target) => Object.fromEntries(new FormData(target));

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_ANON_KEY);

export const toLocalISOString = (date) => {
  const lokal = new Date(date - date.getTimezoneOffset() * 60000);
  lokal.setSeconds(null);
  lokal.setMilliseconds(null);
  return lokal.toISOString().slice(0, -1);
};

export const fetchJson = async (uri, method) =>
  await fetch(uri).then((x) => x.json());

export const postJson = async (uri, data) =>
  await fetch(uri, {
    body: JSON.stringify(data),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((x) => x.json());

export const useQFetchFn = (fn, key, opts) =>
  useQuery({
    queryKey: key,
    queryFn: fn,
    refetchInterval: 10000,
    refetchOnReconnect: true,
    gcTime: Infinity,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    ...opts,
  });
