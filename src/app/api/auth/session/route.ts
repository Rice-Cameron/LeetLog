import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";

export async function GET(request: Request) {
  try {
    const user = await stackServerApp.getUser({ tokenStore: request });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
