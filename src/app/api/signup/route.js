import { signIn } from "@/auth";
import db from "@/database/db";
import User from "@/database/models/user.model";
import { NextResponse } from "next/server";
export async function POST(req) {
  try {
    const rawData = await req.json();
    await db();
    const rawResponse = await User.signup(rawData);
    const responseData = rawResponse.toObject();
    //setting cookies to keep login
     await signIn("credentials", {
      redirect: false,
      email: responseData.email,
      _id: responseData._id,
      name: `${responseData.firstName}-${responseData.lastName}`,
      image: "xyz",
    });
    return NextResponse.json(
      {
        resData: { ...responseData },
        success: true,
        code: 1,
        message: "Signup successful",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    if (err.name === "SignupError") {
      return NextResponse.json(
        {
          resData: {},
          success: false,
          code: 0,
          message: err.message,
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
    //Other Error
    return NextResponse.json(
      {
        resData: {},
        success: false,
        code: 0,
        message: "Internal Server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
