import { NextRequest, NextResponse } from "next/server";
import { getDocumentUrl } from "@/lib/team-resources-db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get storage_path from query params
    const searchParams = request.nextUrl.searchParams;
    const storagePath = searchParams.get("storage_path");

    if (!storagePath) {
      return NextResponse.json(
        { error: "storage_path is required" },
        { status: 400 }
      );
    }

    // Generate signed URL (valid for 1 hour)
    const result = await getDocumentUrl(storagePath, 3600);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to generate URL" },
        { status: 500 }
      );
    }

    // Redirect to the signed URL
    return NextResponse.redirect(result.data!);
  } catch (error) {
    console.error("Error generating document URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
