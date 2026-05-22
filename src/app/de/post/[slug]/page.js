import { redirect } from "next/navigation";
import { resolveParams } from "@/lib/params";

export default async function GermanPostRedirectPage({ params }) {
  const { slug } = resolveParams(await params);
  redirect(slug ? `/de/${slug}` : "/de");
}
