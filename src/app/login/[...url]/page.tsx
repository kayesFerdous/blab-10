import SignInPage from "@/components/SignInComponent";

export default async function Page({ params }: {
  params: Promise<{ url: string[] }>
}) {
  const decodedUrl = (await params).url;
  console.log(decodedUrl);

  return <SignInPage path={decodedUrl} />
}
