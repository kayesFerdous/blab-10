"use server"

import { signIn } from "@/auth";

export default async function resendLogin(formdata: FormData) {
  console.log("username: ", formdata.get("username"), "\nemail: ", formdata.get("email"));
  await signIn("resend", formdata);
}
