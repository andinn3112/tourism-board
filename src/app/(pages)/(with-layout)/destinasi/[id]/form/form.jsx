"use client";
import { Button } from "@/components/ui/button";
import { action } from "./action";
import { InputText, InputTextarea } from "@/components/input";
import { useEffect, useState } from "react";
import OptionsSelect from "@/components/options/select";
import { createCategory } from "@/lib/query";
import { useNavigate } from "@/hooks/use-navigate";
import { toastAlert } from "@/lib/utils";
import ImageUpload from "@/components/image/upload";
import { Loader2 } from "lucide-react";
import { LoaderSpinner } from "@/components/loader";

export default function Form({ data, categories = [] }) {
   // Format images dengan { imageUrl, fileId }
   const [form, setForm] = useState({
      ...data,
      kategori: data?.kategori?.slug,
      images:
         data?.images?.map((img) => ({
            imageUrl: img.imageUrl,
            fileId: img.fileId,
         })) || [],
   });

   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);
   const [canceling, setCanceling] = useState(false);
   const navigate = useNavigate();

   const handleCreateCategory = async (newCategoryName) => {
      const category = await createCategory(newCategoryName);
      categories.push(category);
      setForm((prev) => ({
         ...prev,
         kategori: category?.slug,
      }));
   };
   console.log({ categories });

   const categoryOptions = categories.map((cat) => ({
      value: cat.slug,
      label: cat.nama,
   }));

   useEffect(() => {
      setForm({
         ...data,
         kategori: data?.kategori?.slug || "",
         images:
            data?.images?.map((img) => ({
               imageUrl: img.imageUrl,
               fileId: img.fileId,
            })) || [],
      });
   }, [data]);

   // Handler khusus untuk ImageUpload yang sudah mengembalikan format { imageUrl, fileId }[]
   const handleSetImages = (updater) => {
      setForm((prev) => {
         const currentImages = prev.images || [];
         const newImages =
            typeof updater === "function" ? updater(currentImages) : updater;

         return { ...prev, images: newImages };
      });
   };

   const images = form.images.map((dt) => dt.fileId);

   // Cleanup images when form is cancelled
   const handleCancel = async () => {
      setCanceling(true);
      if (images.length > 0) {
         try {
            const response = await fetch("/api/image/delete-many", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ fileIds: images }),
            });

            if (response.ok) {
               console.log(`Cleaned up ${images.length} unused images`);
            }
         } catch (error) {
            console.error("Error cleaning up images:", error);
         }
      }

      navigate("/destinasi");
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6 relative">
         <LoaderSpinner show={loading} />
         <input type="hidden" name="id" value={form?.id || ""} />
         <div className="grid md:grid-cols-2 gap-4">
            <ImageUpload
               name="images"
               label="Destinasi Images"
               value={form?.images || []}
               setValue={handleSetImages}
               multiple
               maxFiles={6}
               errors={errors}
            />
            <div className="space-y-4">
               <InputText
                  label="Nama Destinasi"
                  name="nama"
                  value={form?.nama}
                  setValue={setForm}
                  errors={errors}
               />
               <InputTextarea
                  label="Deskripsi"
                  name="deskripsi"
                  value={form?.deskripsi}
                  setValue={setForm}
                  errors={errors}
               />
               <OptionsSelect
                  name="kategori"
                  label="Kategori"
                  placeholder="Pilih atau buat kategori..."
                  value={form?.kategori}
                  setValue={setForm}
                  options={categoryOptions}
                  onCreateOption={handleCreateCategory}
                  errors={errors}
               />
               <InputText
                  label="Alamat"
                  name="alamat"
                  value={form?.alamat}
                  setValue={setForm}
                  errors={errors}
               />
               <InputText
                  label="Koordinat"
                  name="koordinat"
                  value={form?.koordinat}
                  setValue={setForm}
                  errors={errors}
               />
            </div>
         </div>
         <div className="flex justify-end gap-2">
            <Button
               type="button"
               variant="ghost"
               disabled={canceling}
               onClick={handleCancel}
            >
               {canceling && <Loader2 className="size-3 animate-spin" />} Batal
            </Button>
            <Button disabled={loading}>
               {loading ? "Menyimpan" : "Simpan"}{" "}
               {loading && <Loader2 className="size-3 animate-spin" />}
            </Button>
         </div>
      </form>
   );

   async function handleSubmit(e) {
      e.preventDefault();
      setLoading(true);

      try {
         const result = await action(form);

         if (result.success) {
            toastAlert("success", "Destinasi berhasil disimpan.");
            navigate("/destinasi");
         } else {
            setErrors(result.errors || {});
            toastAlert("error", "Destinasi gagal disimpan.");
            console.log("Errors:", result.errors);
         }
      } catch (error) {
         console.error("Gagal:", error);
         toastAlert("error", "Terjadi kesalahan saat menyimpan.");
      } finally {
         setLoading(false);
      }
   }
}
