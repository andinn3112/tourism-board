"use client";

import { SITE_NAME } from "@/lib/env";
import { ImageKitAbortError, upload } from "@imagekit/next";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { strToUnderscore } from "@/lib/formater";
import { Trash2, Upload, Loader2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const ImageUpload = ({
   label,
   value = [],
   name,
   setValue,
   multiple = false,
   folder = `${strToUnderscore(SITE_NAME)}/destinations`,
   maxFiles = 10,
   onDeleteFile,
   maxWidth = 1200,
   quality = 80,
   convertToWebp = true,
   errors,
}) => {
   const [uploading, setUploading] = useState(false);
   const [progress, setProgress] = useState(0);
   const [deletingFiles, setDeletingFiles] = useState([]);
   const fileInputRef = useRef(null);
   const abortControllerRef = useRef(null);

   const hasErrors = !!errors?.[name]?.length;
   const errorMessage = errors?.[name]?.[0] ?? "";

   // Pastikan value selalu array
   const currentFiles = Array.isArray(value) ? value : [];

   const authenticator = async () => {
      try {
         const response = await fetch("/api/image/auth");
         if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
         return await response.json();
      } catch (error) {
         console.error("Authentication error:", error);
         throw error;
      }
   };

   const handleFileSelect = async (event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Validasi
      const totalAfterUpload = currentFiles.length + files.length;
      if (totalAfterUpload > maxFiles) {
         alert(
            `Maksimal ${maxFiles} file. Sudah ada ${currentFiles.length} file.`
         );
         return;
      }

      if (!multiple && files.length > 1) {
         alert("Hanya boleh upload 1 file");
         return;
      }

      // Validasi ukuran (5MB)
      const maxSize = 10 * 1024 * 1024;
      for (const file of files) {
         if (file.size > maxSize) {
            alert(`File ${file.name} melebihi 10MB`);
            return;
         }
      }

      setUploading(true);
      setProgress(0);

      const uploadedFiles = [];

      try {
         for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Update progress
            const fileProgress = Math.round(((i + 1) / files.length) * 100);
            setProgress(fileProgress);

            const auth = await authenticator();
            const { signature, expire, token, publicKey } = auth;

            // Transformasi
            const transformations = [];
            if (maxWidth) transformations.push(`w-${maxWidth}`);
            if (convertToWebp) transformations.push("f-webp");
            transformations.push(`q-${quality}`);

            abortControllerRef.current = new AbortController();

            const uploadResponse = await upload({
               expire,
               token,
               signature,
               publicKey,
               folder,
               file,
               fileName: `${Date.now()}`,
               useUniqueFileName: true,
               transformations,
               tags: ["optimized", convertToWebp ? "webp" : "original"],
               abortSignal: abortControllerRef.current.signal,
            });

            const optimizedUrl =
               transformations.length > 0
                  ? `${uploadResponse.url}?tr=${transformations.join(",")}`
                  : uploadResponse.url;

            const newFile = {
               fileId: uploadResponse.fileId,
               imageUrl: uploadResponse.url,
            };

            uploadedFiles.push(newFile);
         }

         // Update parent dengan file baru
         if (uploadedFiles.length > 0 && setValue) {
            setValue((prev) => {
               const currentValue = Array.isArray(prev) ? prev : [];
               return [...currentValue, ...uploadedFiles];
            });
         }
      } catch (error) {
         console.error("Upload error:", error);
         if (!(error instanceof ImageKitAbortError)) {
            alert("Gagal upload file. Coba lagi.");
         }
      } finally {
         setUploading(false);
         setProgress(0);
      }
   };

   const handleDeleteFile = async (fileId) => {
      if (!confirm("Hapus gambar ini?")) return;

      try {
         setDeletingFiles((prev) => [...prev, fileId]);

         const response = await fetch("/api/image/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId }),
         });

         if (!response.ok) throw new Error("Delete failed");

         const result = await response.json();
         if (!result.success) throw new Error(result.error || "Delete failed");

         // Update parent - hapus file dari value
         if (setValue) {
            setValue((prev) => {
               const currentValue = Array.isArray(prev) ? prev : [];
               const newValue = currentValue.filter(
                  (file) => file.fileId !== fileId
               );
               return newValue;
            });
         }

         if (onDeleteFile) onDeleteFile(fileId);
      } catch (error) {
         console.error("Delete error:", error);
         alert("Gagal menghapus file");
      } finally {
         setDeletingFiles((prev) => prev.filter((id) => id !== fileId));
      }
   };

   const handleCancelUpload = () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setUploading(false);
      setProgress(0);
   };

   const handleDrop = (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
         f.type.startsWith("image/")
      );
      if (files.length > 0) {
         const event = { target: { files } };
         handleFileSelect(event);
      }
   };

   const handleDragOver = (e) => {
      e.preventDefault();
   };

   const getImageUrl = (file) => {
      if (!file) return "";
      if (typeof file === "string") return file;
      if (file.thumbnailUrl) return file.thumbnailUrl;
      if (file.optimizedUrl) return file.optimizedUrl;
      if (file.imageUrl) return file.imageUrl;
      return file;
   };

   const triggerFileInput = () => {
      if (!uploading && currentFiles.length < maxFiles) {
         fileInputRef.current?.click();
      }
   };

   const previewImage = (url) => {
      if (url) window.open(url, "_blank");
   };

   return (
      <div className="space-y-4">
         {label && <label className="block text-sm font-medium">{label}</label>}
         {/* Upload Area */}
         <div
            className={cn(
               "border-2 border-dashed rounded-lg p-6 bg-input/30 text-center transition-all duration-300",
               uploading || currentFiles.length >= maxFiles
                  ? "cursor-not-allowed"
                  : "hover:border-primary cursor-pointer",
               hasErrors && "border-destructive"
            )}
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
         >
            <input
               type="file"
               ref={fileInputRef}
               onChange={handleFileSelect}
               multiple={multiple}
               accept="image/*"
               disabled={uploading || currentFiles.length >= maxFiles}
               className="hidden"
            />

            <div className="space-y-3">
               <div className="flex justify-center">
                  <div
                     className={`p-3 rounded-full ${
                        uploading ? "bg-blue-100" : "bg-gray-100"
                     }`}
                  >
                     {uploading ? (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                     ) : (
                        <Upload className="w-6 h-6 text-gray-500" />
                     )}
                  </div>
               </div>

               <div>
                  <p
                     className={`text-sm font-medium ${
                        uploading || currentFiles.length >= maxFiles
                           ? "text-gray-400"
                           : "text-foreground"
                     }`}
                  >
                     {uploading
                        ? "Mengupload..."
                        : currentFiles.length >= maxFiles
                        ? "File maksimal tercapai"
                        : "Klik atau drop gambar di sini"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                     {multiple
                        ? `Maksimal ${maxFiles} file (10MB/file)`
                        : "1 file (maks 5MB)"}
                  </p>
               </div>

               {currentFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                     {currentFiles.length} dari maksimal {maxFiles} gambar
                     terupload
                  </p>
               )}
            </div>
         </div>
         {/* Progress Bar */}
         {uploading && (
            <div className="border border-blue-200 rounded-lg p-4 bg-input/30">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-700">
                     Mengupload...
                  </span>
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={handleCancelUpload}
                     className="h-8 text-xs"
                  >
                     Batalkan
                  </Button>
               </div>
               <Progress
                  value={progress}
                  max={100}
                  className="h-2 bg-blue-100"
               />
               <p className="text-xs text-blue-600 mt-2 text-center">
                  {progress}%
               </p>
            </div>
         )}
         {/* Preview Images */}
         {currentFiles.length > 0 && (
            <div className="border rounded-lg p-4 bg-input/30">
               <h4 className="text-sm font-medium text-foreground mb-3">
                  Gambar Terupload ({currentFiles.length}/{maxFiles})
               </h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentFiles.map((file, index) => {
                     const imageUrl = getImageUrl(file);

                     return (
                        <div
                           key={file.fileId || index}
                           className="relative group"
                        >
                           <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                              <img
                                 src={imageUrl}
                                 alt={
                                    file.name ||
                                    file.originalName ||
                                    `Gambar ${index + 1}`
                                 }
                                 className="w-full h-full object-cover"
                                 onError={(e) => {
                                    e.target.onerror = null;
                                 }}
                              />

                              <button
                                 type="button"
                                 onClick={() =>
                                    previewImage(
                                       file.imageUrl ||
                                          file.optimizedUrl ||
                                          imageUrl
                                    )
                                 }
                                 className="absolute top-1 left-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                 title="Lihat full size"
                              >
                                 <Eye className="w-3 h-3" />
                              </button>

                              <button
                                 type="button"
                                 onClick={() => handleDeleteFile(file.fileId)}
                                 disabled={deletingFiles.includes(file.fileId)}
                                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                                 title="Hapus gambar"
                              >
                                 {deletingFiles.includes(file.fileId) ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                 ) : (
                                    <Trash2 className="w-3 h-3" />
                                 )}
                              </button>
                           </div>

                           <p className="text-xs text-foreground/60 truncate mt-1">
                              {file.originalName?.split("_").pop() ||
                                 file.name?.split("_").pop() ||
                                 `Gambar ${index + 1}`}
                           </p>

                           <div className="text-xs text-gray-400 flex justify-between mt-1">
                              {file.format && (
                                 <span className="bg-input/40 px-1 rounded">
                                    {file.format.toUpperCase()}
                                 </span>
                              )}
                              {file.size && (
                                 <span>{Math.round(file.size / 1024)}KB</span>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
         {hasErrors && (
            <p id={`${name}-error`} className="text-sm text-destructive">
               {errorMessage}
            </p>
         )}
      </div>
   );
};

export const deleteImageKitFile = async (fileId) => {
   try {
      const response = await fetch("/api/image/delete", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ fileId }),
      });
      return await response.json();
   } catch (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
   }
};

export const deleteImageKitFiles = async (fileIds) => {
   if (!fileIds?.length) return { success: true, deleted: 0 };
   try {
      const response = await fetch("/api/image/delete-many", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ fileIds }),
      });
      return await response.json();
   } catch (error) {
      console.error("Bulk delete error:", error);
      return { success: false, error: error.message, deleted: 0 };
   }
};

export default ImageUpload;
