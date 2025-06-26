import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Sign in is handled on the frontend. Use the <SignIn /> component.",
    },
    { status: 400 }
  );
}
