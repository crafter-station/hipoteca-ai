import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { generateUserId } from "./user-identification";

export async function getUserId() {
  const session = await auth();

  if (!session.userId) {
    const _headers = await headers();
    return generateUserId({
      "x-forwarded-for": _headers.get("x-forwarded-for") || "",
      "user-agent": _headers.get("user-agent") || "",
      "accept-language": _headers.get("accept-language") || "",
      "sec-ch-ua": _headers.get("sec-ch-ua") || "",
      "sec-ch-ua-platform": _headers.get("sec-ch-ua-platform") || "",
    });
  }

  return session.userId;
}
