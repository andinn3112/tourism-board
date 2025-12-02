// API endpoint for deleting files from ImageKit
export const deleteImageKitFile = async (fileId) => {
   try {
      const response = await fetch("/api/image/delete", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ fileId }),
      });

      if (!response.ok) {
         throw new Error(`Failed to delete file: ${response.status}`);
      }

      return await response.json();
   } catch (error) {
      console.error("Error deleting file:", error);
      return {
         success: false,
         error: error.message,
      };
   }
};

// Bulk delete function for save action
export const deleteImageKitFiles = async (fileIds) => {
   if (!fileIds || fileIds.length === 0) return { success: true, deleted: 0 };

   try {
      const response = await fetch("/api/image/delete-many", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ fileIds }),
      });

      if (!response.ok) {
         throw new Error(`Failed to delete files: ${response.status}`);
      }

      return await response.json();
   } catch (error) {
      console.error("Error in deleteImageKitFiles:", error);
      return {
         success: false,
         error: error.message,
         deleted: 0,
      };
   }
};
