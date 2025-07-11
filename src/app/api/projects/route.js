import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { encrypt, decrypt } from "@/lib/encryption";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/logActivity";
import User from "@/models/User";

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

    const projects = await Project.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    const decrypted = projects.map((proj) => ({
      ...proj,
      envGroups:
        proj.envGroups?.map((group) => ({
          groupName: group.groupName,
          variables: group.variables.map((e) => ({
            key: decrypt(e.key),
            value: decrypt(e.value),
          })),
        })) || [],
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

    const encryptedGroups = (data.envGroups || []).map((group) => ({
      groupName: group.groupName,
      variables: group.variables.map((e) => ({
        key: encrypt(e.key),
        value: encrypt(e.value),
      })),
    }));

    const project = await Project.create({
      ...data,
      envGroups: encryptedGroups,
      userId,
    });

    const decrypted = {
      ...project._doc,
      envGroups: encryptedGroups.map((group) => ({
        groupName: group.groupName,
        variables: group.variables.map((e) => ({
          key: decrypt(e.key),
          value: decrypt(e.value),
        })),
      })),
    };

    await logActivity(
      userId,
      "project_created",
      `Created project "${data.title}"`,
      {
        projectId: project._id,
      }
    );

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

    if (updates.envGroups) {
      updates.envGroups = updates.envGroups.map((group) => ({
        groupName: group.groupName,
        variables: group.variables.map((e) => ({
          key: encrypt(e.key),
          value: encrypt(e.value),
        })),
      }));
    }

    if (updates.userId) {
      const userExists = await User.exists({ _id: updates.userId });
      if (!userExists) {
        return NextResponse.json(
          { error: "Cannot update: referenced user does not exist" },
          { status: 400 }
        );
      }
    }

    const updated = await Project.findByIdAndUpdate(id, updates, { new: true });

    const decrypted = {
      ...updated.toObject(),
      envGroups: updated.envGroups.map((group) => ({
        groupName: group.groupName,
        variables: group.variables.map((e) => ({
          key: decrypt(e.key),
          value: decrypt(e.value),
        })),
      })),
    };

    await logActivity(
      userId,
      "project_updated",
      `Updated project "${updated.title}"`,
      {
        projectId: updated._id,
      }
    );

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

    await logActivity(
      userId,
      "project_deleted",
      `Deleted project "${project.title}"`,
      {
        projectId: project._id,
      }
    );
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 401 }
    );
  }
}
