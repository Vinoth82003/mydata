import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
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
    const projects = await Project.find({ userId }).lean();

    const decrypted = projects.map((proj) => ({
      ...proj,
      env: proj.env.map((e) => ({
        key: decrypt(e.key),
        value: decrypt(e.value),
      })),
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

    const encryptedEnv = data.env.map((e) => ({
      key: encrypt(e.key),
      value: encrypt(e.value),
    }));

    const project = await Project.create({
      ...data,
      env: encryptedEnv,
      userId,
    });

    // Decrypt only before sending back (not in DB)
    const decrypted = {
      ...project._doc,
      env: project.env.map((e) => ({
        key: decrypt(e.key),
        value: decrypt(e.value),
      })),
    };

    return NextResponse.json({ success: true, data: decrypted });
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
    const project = await Project.findById(id);

    if (!project || project.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    // Encrypt env if included
    if (updates.env) {
      updates.env = updates.env.map((e) => ({
        key: encrypt(e.key),
        value: encrypt(e.value),
      }));
    }

    const updated = await Project.findByIdAndUpdate(id, updates, {
      new: true,
    });

    const decrypted = {
      ...updated.toObject(),
      env: updated.env.map((e) => ({
        key: decrypt(e.key),
        value: decrypt(e.value),
      })),
    };

    return NextResponse.json({ success: true, data: decrypted });
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

    const project = await Project.findById(id);
    if (!project || project.userId.toString() !== userId)
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}
