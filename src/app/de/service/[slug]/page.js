import { redirect } from "next/navigation";
import { resolveParams } from "@/lib/params";

export default async function GermanServiceRedirectPage({ params }) {
  const { slug } = resolveParams(await params);
  redirect(slug ? `/de/dienstleistungen/${slug}` : "/de/dienstleistungen");
}
