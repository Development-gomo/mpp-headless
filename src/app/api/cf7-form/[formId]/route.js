import { getWPBaseUrl } from "@/config";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { formId } = await params;

  if (!/^\d+$/.test(formId)) {
    return Response.json({ message: "Invalid contact form ID." }, { status: 400 });
  }

  const language = new URL(request.url).searchParams.get("lang");
  const searchParams = new URLSearchParams();
  if (language) searchParams.set("lang", language);

  try {
    const response = await fetch(
      `${getWPBaseUrl()}/wp-json/headless/v1/cf7-form/${formId}?${searchParams}`,
      { cache: "no-store" }
    );
    const json = await response.json().catch(() => ({
      message: "WordPress returned an invalid response.",
    }));

    return Response.json(json, { status: response.status });
  } catch (error) {
    return Response.json(
      { message: error?.message || "Unable to load the contact form." },
      { status: 502 }
    );
  }
}
