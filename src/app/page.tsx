"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") return <>loading ...</>

  if (session?.user) console.log(session.user);


  return (
    <div>
      this is the home page <br />
      <Link href={"/user"}>User Page</Link>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
