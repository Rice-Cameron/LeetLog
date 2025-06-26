import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("X-Stack-Signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Read the raw body as a buffer
    const rawBody = await request.arrayBuffer();
    const bodyBuffer = Buffer.from(rawBody);

    // Compute HMAC-SHA256 using your webhook secret
    const secret = process.env.STACK_WEBHOOK_SECRET!;
    const hmac = createHmac("sha256", secret);
    hmac.update(bodyBuffer);
    const digest = hmac.digest("hex");

    // Compare signatures using timingSafeEqual
    const valid =
      signature.length === digest.length &&
      timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(digest, "hex")
      );
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the JSON body
    const body = JSON.parse(bodyBuffer.toString());

    // Handle different webhook events
    switch (body.type) {
      case "user.created":
        await handleUserCreated(body.data);
        break;
      case "user.updated":
        await handleUserUpdated(body.data);
        break;
      case "user.deleted":
        await handleUserDeleted(body.data);
        break;
      default:
        console.log("Unhandled webhook event:", body.type);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Assumes userData has at least id and email fields from Stack Auth
async function handleUserCreated(userData: any) {
  try {
    await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        email: userData.email,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
      },
      create: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
      },
    });
    console.log("User created or updated:", userData);
  } catch (error) {
    console.error("Error syncing user (created):", error, userData);
  }
}

async function handleUserUpdated(userData: any) {
  try {
    await prisma.user.update({
      where: { id: userData.id },
      data: {
        email: userData.email,
        firstName: userData.firstName ?? null,
        lastName: userData.lastName ?? null,
      },
    });
    console.log("User updated:", userData);
  } catch (error) {
    console.error("Error syncing user (updated):", error, userData);
  }
}

async function handleUserDeleted(userData: any) {
  try {
    await prisma.user.delete({
      where: { id: userData.id },
    });
    console.log("User deleted:", userData);
  } catch (error) {
    console.error("Error syncing user (deleted):", error, userData);
  }
}
