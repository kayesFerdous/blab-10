"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

const upgradeUser = async () => {
  await fetch(`/api/user`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
  })
}

const deleteUser = async () => {
  const response = await fetch("/api/user", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  })

  if (response) signOut();
}

export default function Page() {
  const { data: session } = useSession();

  if (!session) redirect("/");

  return (
    <div>
      hello {session?.user?.name} <br />
      <button onClick={() => signOut()}>Sign Out</button> <br /> <br />

      <Link href="/" className="hover:bg-white text-black bg-gray-300 rounded-md p-2">Home</Link>
      <br /> <br />

      <button onClick={upgradeUser} className=" 
      bg-cyan-800 hover:bg-cyan-300 text-black p-2 rounded-md
      "> Upgrade to Super User </button>
      <br /> <br />

      <button onClick={deleteUser} className=" 
      bg-red-800 hover:bg-red-300 text-black p-2 rounded-md
      "> Delete User </button>


    </div>
  );
}
