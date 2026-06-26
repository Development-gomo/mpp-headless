import { getWPBaseUrl } from "@/config";

function getAllowedPdfUrl(value) {
  const requestedUrl = new URL(value);
  const wpUrl = new URL(getWPBaseUrl());
  const uploadsPath = `${wpUrl.pathname.replace(/\/$/, "")}/wp-content/uploads/`;

  if (
    requestedUrl.protocol !== "https:" ||
    requestedUrl.origin !== wpUrl.origin ||
    !requestedUrl.pathname.startsWith(uploadsPath) ||
    !requestedUrl.pathname.toLowerCase().endsWith(".pdf")
  ) {
    throw new Error("PDF URL is outside the configured WordPress uploads directory.");
  }

  return requestedUrl;
}

export async function GET(request) {
  try {
    const source = new URL(request.url).searchParams.get("url");
    if (!source) {
      return Response.json({ error: "Missing PDF URL." }, { status: 400 });
    }

    const pdfUrl = getAllowedPdfUrl(source);
    const response = await fetch(pdfUrl, { next: { revalidate: 3600 } });

    if (!response.ok || !response.body) {
      return Response.json({ error: "Unable to load the catalog PDF." }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.toLowerCase().includes("pdf") &&
      !contentType.toLowerCase().includes("octet-stream")
    ) {
      return Response.json({ error: "The catalog source is not a PDF." }, { status: 415 });
    }

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=3600",
    });
    const contentLength = response.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new Response(response.body, { headers });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
