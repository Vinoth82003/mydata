import { cookies } from "next/headers";
import { verifyToken, generateAccessToken } from "@/lib/auth";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_SECRET);
    const accessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
    });

    return Response.json({ accessToken });
  } catch (err) {
    return Response.json({ error: "Invalid refresh token" }, { status: 403 });
  }
}
