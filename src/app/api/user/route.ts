import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function PATCH() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({
      message: "Unothorized"
    }, {
      status: 401
    })
  }

  try {
    const response = await db
      .update(users)
      .set({ role: "super-user" })
      .where(eq(users.id, session.user.id))
      .returning({ updatedId: users.id });

    console.log(response);

    if (response.length == 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User upgraded to super-user succssfully",
      user: response[0]
    },
      { status: 200 });
  } catch (error) {
    console.log("Error updrading user", error);
    return NextResponse.json({ message: "Internal server error" },
      { status: 500 });
  }

}

export async function DELETE() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({
      message: "Unothorized",
    }, {
      status: 401
    })
  }

  try {
    const response = await db
      .delete(users)
      .where(eq(users.id, session.user.id))
      .returning({ deletedId: users.id })

    if (response.length == 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User deleted successfully"
    }, {
      status: 200
    })
  } catch (error) {
    console.log("Error delering user", error);

    return NextResponse.json({
      message: "Internal server error"
    }, {
      status: 500
    })
  }
}


