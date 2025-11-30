"use client";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X, Upload, Image as ImageIcon } from "lucide-react";

export function InputImage({
   name,
   label = "Images",
   value = [],
   setValue,
   errors,
   hint,
   className,
   disabled,
   multiple = true,
   maxFiles = 10,
   accept = "image/*",
}) {
   const fileInputRef = useRef(null);
   const [previews, setPreviews] = useState([]);
   const [isDragging, setIsDragging] = useState(false);

   const hasErrors = !!errors?.[name]?.length;
   const errorMessage = errors?.[name]?.[0] ?? "";

   // Initialize previews from value (for edit mode)
   useEffect(() => {
      const currentValue = Array.isArray(value) ? value : [];

      // Filter hanya string URL (existing images dari database)
      const urlValues = currentValue.filter(
         (item) => typeof item === "string" && item.startsWith("http")
      );

      // Filter hanya File objects (new uploaded files)
      const fileValues = currentValue.filter((item) => item instanceof File);

      // Create previews untuk existing URL images
      const urlPreviews = urlValues.map((url) => ({
         url, // Simpan URL asli
         preview: url, // Gunakan URL langsung untuk preview
         name: url.split("/").pop() || "image",
         size: 0, // Size tidak tersedia untuk existing images
         isExisting: true, // Flag untuk existing images
      }));

      // Create previews untuk new uploaded files
      const filePreviews = fileValues.map((file) => ({
         file,
         preview: URL.createObjectURL(file),
         name: file.name,
         size: file.size,
         isExisting: false,
      }));

      setPreviews([...urlPreviews, ...filePreviews]);
   }, [value]);

   // Cleanup object URLs ketika component unmount
   useEffect(() => {
      return () => {
         previews.forEach((preview) => {
            if (!preview.isExisting && preview.preview) {
               URL.revokeObjectURL(preview.preview);
            }
         });
      };
   }, []);

   // Handle file selection
   const handleFileChange = (files) => {
      const fileArray = Array.from(files);

      // Get current value safely
      const currentValue = Array.isArray(value) ? value : [];

      // Validate file count
      if (currentValue.length + fileArray.length > maxFiles) {
         alert(`Maximum ${maxFiles} files allowed`);
         return;
      }

      // Create previews for new files
      const newPreviews = fileArray.map((file) => ({
         file,
         preview: URL.createObjectURL(file),
         name: file.name,
         size: file.size,
         isExisting: false,
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);

      // Update form value
      if (setValue) {
         const newFiles = [...currentValue, ...fileArray];

         setValue((prev) => {
            // Jika prev adalah array, return array baru
            if (Array.isArray(prev)) {
               return newFiles;
            }
            // Jika prev adalah object, update property-nya
            else if (typeof prev === "object" && prev !== null) {
               return {
                  ...prev,
                  [name]: newFiles,
               };
            }
            // Fallback
            return { [name]: newFiles };
         });
      }
   };

   // Remove image
   const removeImage = (index) => {
      const previewToRemove = previews[index];

      // Cleanup object URL jika bukan existing image
      if (!previewToRemove.isExisting && previewToRemove.preview) {
         URL.revokeObjectURL(previewToRemove.preview);
      }

      setPreviews((prev) => {
         const newPreviews = [...prev];
         newPreviews.splice(index, 1);
         return newPreviews;
      });

      if (setValue) {
         const currentValue = Array.isArray(value) ? value : [];
         const newFiles = currentValue.filter((_, i) => i !== index);

         setValue((prev) => {
            // Jika prev adalah array, return array baru
            if (Array.isArray(prev)) {
               return newFiles;
            }
            // Jika prev adalah object, update property-nya
            else if (typeof prev === "object" && prev !== null) {
               return {
                  ...prev,
                  [name]: newFiles,
               };
            }
            // Fallback
            return { [name]: newFiles };
         });
      }
   };

   // Handle drop event
   const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
         handleFileChange(files);
      }
   };

   // Handle drag events
   const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
   };

   const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
   };

   // Format file size
   const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
   };

   // Get current files count safely
   const currentFilesCount = Array.isArray(value) ? value.length : 0;

   return (
      <div className={cn("space-y-3", className)}>
         <Label htmlFor={name}>{label}</Label>

         {/* File Input (Hidden) */}
         <Input
            ref={fileInputRef}
            id={name}
            name={name}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            disabled={disabled}
         />

         {/* Upload Area */}
         <div
            className={cn(
               "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
               isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50",
               disabled && "opacity-50 cursor-not-allowed",
               hasErrors && "border-destructive"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && fileInputRef.current?.click()}
         >
            <div className="flex flex-col items-center justify-center gap-2">
               <Upload className="h-8 w-8 text-muted-foreground" />
               <div className="space-y-1">
                  <p className="text-sm font-medium">
                     Drop images here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                     PNG, JPG, GIF up to 10MB each
                  </p>
                  <p className="text-xs text-muted-foreground">
                     {currentFilesCount}/{maxFiles} files selected
                  </p>
               </div>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
               >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Choose Files
               </Button>
            </div>
         </div>

         {/* Image Previews */}
         {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {previews.map((preview, index) => (
                  <div
                     key={index}
                     className="relative group border rounded-lg overflow-hidden bg-muted/50"
                  >
                     {/* Image Preview */}
                     <div className="aspect-square relative">
                        <img
                           src={preview.preview}
                           alt={preview.name}
                           className="w-full h-full object-cover"
                        />

                        {/* Remove Button */}
                        <Button
                           type="button"
                           variant="destructive"
                           size="icon"
                           className="absolute top-2 right-2 h-6 w-6 opacity-50 group-hover:opacity-100 transition-opacity"
                           onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                           }}
                           disabled={disabled}
                        >
                           <X className="h-3 w-3" />
                        </Button>

                        {/* File Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                           <p className="truncate font-medium">
                              {preview.name}
                           </p>
                           <p className="text-muted">
                              {preview.isExisting
                                 ? "Existing image"
                                 : formatFileSize(preview.size)}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Error Message */}
         {hasErrors && (
            <p id={`${name}-error`} className="text-sm text-destructive">
               {errorMessage}
            </p>
         )}

         {/* Hint */}
         {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
   );
}
