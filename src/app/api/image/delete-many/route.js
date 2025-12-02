import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function POST(request) {
   try {
      const { fileIds } = await request.json();

      if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
         return NextResponse.json(
            { success: false, error: "Valid fileIds array is required" },
            { status: 400 }
         );
      }

      // Delete files sequentially
      const results = [];
      for (const fileId of fileIds) {
         try {
            const result = await imagekit.deleteFile(fileId);
            results.push({
               fileId,
               success: true,
               result,
            });
         } catch (error) {
            results.push({
               fileId,
               success: false,
               error: error.message,
            });
         }
      }

      const successfulDeletes = results.filter((r) => r.success);
      const failedDeletes = results.filter((r) => !r.success);

      return NextResponse.json({
         success: true,
         deleted: successfulDeletes.length,
         failed: failedDeletes.length,
         details: results,
      });
   } catch (error) {
      console.error("Error deleting multiple files:", error);
      return NextResponse.json(
         {
            success: false,
            error: error.message || "Failed to delete files",
         },
         { status: 500 }
      );
   }
}
