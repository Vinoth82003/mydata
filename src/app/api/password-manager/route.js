import { connectDB } from "@/lib/db";
import PasswordEntry from "@/models/PasswordEntry";
import { encrypt, decrypt } from "@/lib/encryption";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

async function getUserId(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized");
  const decoded = verifyToken(token, process.env.ACCESS_SECRET);
  if (!decoded?.id) throw new Error("Invalid token");
  return decoded.id;
}

export async function GET(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();
    const entries = await PasswordEntry.find({ userId }).lean();
    const decrypted = entries.map((e) => ({
      ...e,
      password: decrypt(e.password),
    }));
    return NextResponse.json({ success: true, data: decrypted });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}

export async function POST(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();
    const data = await req.json();
    const encrypted = encrypt(data.password);
    const entry = await PasswordEntry.create({
      ...data,
      password: encrypted,
      userId,
    });
    return NextResponse.json({ success: true, data: entry });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}

export async function PATCH(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();
    const { id, updates } = await req.json();
    const entry = await PasswordEntry.findById(id);
    if (!entry || entry.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    if (updates.password) updates.password = encrypt(updates.password);
    const updated = await PasswordEntry.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}

export async function DELETE(req) {
  try {
    const userId = await getUserId(req);
    await connectDB();
    const id = req.nextUrl.searchParams.get("id");
    const entry = await PasswordEntry.findById(id);
    if (!entry || entry.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    await PasswordEntry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Entry deleted" });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}
