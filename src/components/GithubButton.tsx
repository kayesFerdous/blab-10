import { signIn } from "@/auth";
import { Button } from "./ui/button";
export default function GithubButton() {
  return (
    <form action={async () => {
      "use server"
      await signIn("github")
    }}>
      <Button type="submit" variant="default">Sign In With Github</Button>
    </form>
  )

}
