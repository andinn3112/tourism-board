import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
   try {
      const { fileId } = await request.json();

      if (!fileId) {
         return NextResponse.json(
            { success: false, error: "File ID is required" },
            { status: 400 }
         );
      }

      const result = await imagekit.deleteFile(fileId);

      return NextResponse.json({
         success: true,
         message: "File deleted successfully",
         result,
      });
   } catch (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json(
         {
            success: false,
            error: error.message || "Failed to delete file",
         },
         { status: 500 }
      );
   }
}
