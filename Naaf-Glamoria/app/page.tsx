import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Root() {
  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") || "";

  if (acceptLang.startsWith("ar")) {
    redirect("/ar");
  }

  redirect("/en");
}