import { redirect } from "next/navigation";
import { resolveParams } from "@/lib/params";

export default async function ServiceRedirectPage({ params }) {
  const { slug } = resolveParams(await params);
  redirect(slug ? `/${slug}` : "/");
}
