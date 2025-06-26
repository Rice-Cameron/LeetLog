import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Sign out is handled on the frontend. Use the <SignOut /> component.",
    },
    { status: 400 }
  );
}
