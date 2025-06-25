import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your webhook secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      await prisma.user.create({
        data: {
          id: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address ?? "",
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Error creating user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.updated") {
    try {
      await prisma.user.update({
        where: { id: evt.data.id },
        data: {
          email: evt.data.email_addresses[0]?.email_address ?? "",
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response("Error updating user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await prisma.user.delete({
        where: { id: evt.data.id },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response("Error deleting user", {
        status: 500,
      });
    }
  }

  return new Response("", { status: 200 });
}
