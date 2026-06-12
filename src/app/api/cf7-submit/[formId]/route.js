import { getWPBaseUrl } from "@/config";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const { formId } = await params;

  if (!/^\d+$/.test(formId)) {
    return Response.json({ message: "Invalid contact form ID." }, { status: 400 });
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${getWPBaseUrl()}/wp-json/headless/v1/cf7-submit/${formId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    const json = await response.json().catch(() => ({
      message: "WordPress returned an invalid response.",
    }));

    return Response.json(json, { status: response.status });
  } catch (error) {
    return Response.json(
      { message: error?.message || "Unable to submit the contact form." },
      { status: 502 }
    );
  }
}
