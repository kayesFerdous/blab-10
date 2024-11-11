import { auth, signIn } from "@/auth";
import GithubButton from "@/components/GithubButton";
// import { MagicLink } from "@/components/MagicLinkButton";
import Link from "next/link";


export default async function Home() {
  const session = await auth();

  if (session) console.log(session.user);


  return (
    <div>
      this is the home page <br />
      <Link href={"/user"}>User Page</Link>

      {session ? <div>hello {session.user?.email}</div> :
        <div>
          <form action={async () => {
            "use server"
            await signIn();
          }}>
            <button type="submit">Sign in </button>
          </form>
        </div>}

      <GithubButton />
      <br /> <br />
      {/* <MagicLink /> */}
    </div>

  )
}
