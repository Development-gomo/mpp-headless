import { redirect } from "next/navigation";
import { resolveParams } from "@/lib/params";

export default async function EnglishServiceRedirectPage({ params }) {
  const { slug } = resolveParams(await params);
  redirect(slug ? `/en/${slug}` : "/en");
}
