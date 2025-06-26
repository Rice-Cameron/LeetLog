import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Sign up is handled on the frontend. Use the <SignUp /> component.",
    },
    { status: 400 }
  );
}
