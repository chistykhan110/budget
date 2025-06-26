import db from "@/database/db";
import { cookies } from "next/headers";
import User from "@/database/models/user.model";
import { NextResponse } from "next/server";
import { signIn } from "@/auth";
export async function POST(req) {
  try {
    const rawData = await req.json();
    //check the cookies to block from requesting to database

    //
    await db();
    const rawResponse = await User.signin(rawData);
    const responseData = rawResponse.toObject();
    //setting cookies to keep login
    await signIn("credentials", {
      redirect: false,
      email: responseData.email,
      _id: responseData._id,
      name: `${responseData.firstName}-${responseData.lastName}`,
      image: "xyz",
    });
    //
    return NextResponse.json(
      {
        resData: { ...responseData },
        success: true,
        code: 1,
        message: "Signin successful",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    if (err.name === "SigninError") {
      //what happens when signin error
      if (err.suspendedTill) {
        const cookieStore = await cookies();
        const cookieName = `suspended-${encodeURIComponent(err.email)}`;
        const suspendedTime = new Date(err.suspendedTill).getTime();
        const maxAge = Math.floor((suspendedTime - Date.now()) / 1000);
        cookieStore.set({
          name: cookieName,
          value: String(suspendedTime),
          maxAge: maxAge > 0 ? maxAge : 0,
          sameSite: "strict",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });
      }

      return NextResponse.json(
        {
          resData: {},
          success: false,
          code: err.path,
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
