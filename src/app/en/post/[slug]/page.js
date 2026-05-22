import { redirect } from "next/navigation";
import { resolveParams } from "@/lib/params";

export default async function EnglishPostRedirectPage({ params }) {
  const { slug } = resolveParams(await params);
  redirect(slug ? `/en/${slug}` : "/en");
}
