import { NextResponse } from "next/server";

export async function GET() {
  const user = process.env.WP_API_USER;
  const pass = process.env.WP_API_PASS;
  const base = process.env.NEXT_PUBLIC_WP_BASE;

  if (!user || !pass || !base) {
    return NextResponse.json([], { status: 200 });
  }

  const token = Buffer.from(`${user}:${pass}`).toString("base64");
  const url = `${base}/wp-json/wp/v2/store?per_page=100&acf_format=standard&context=edit`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[api/stores] WP fetch failed:", res.status);
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("[api/stores] error:", err.message);
    return NextResponse.json([], { status: 200 });
  }
}
