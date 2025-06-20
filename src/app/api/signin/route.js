import db from "@/database/db";
import User from "@/database/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const rawData = await req.json();
    await db();
    const res = await User.signin(rawData)
    console.log(res)
    return NextResponse.json(
      {
        resData: {},
        success: true,
        code: 1,
        message: "Success",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        resData: {},
        success: false,
        code: 0,
        message: err.message || "Something went wrong",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
