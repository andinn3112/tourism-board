"use client";
import { Button } from "@/components/ui/button";
import { action } from "./action";
import { InputImage, InputText, InputTextarea } from "@/components/input";
import { useEffect, useState } from "react";
import OptionsSelect from "@/components/options/select";
import { createCategory } from "@/lib/query";
import { useNavigate } from "@/hooks/use-navigate";
import { toastAlert } from "@/lib/utils";

export default function Form({ data, categories = [] }) {
   const [form, setForm] = useState(data);
   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const handleCreateCategory = async (newCategoryName) => {
      const category = await createCategory(newCategoryName);
      categories.push(category);
      setForm((prev) => ({ ...prev, kategori: category?.slug }));
   };

   const categoryOptions = categories.map((cat) => ({
      value: cat.slug,
      label: cat.nama,
   }));

   useEffect(() => {
      setForm({
         ...data,
         kategori: data?.kategori?.slug,
         images: data?.images?.map((img) => img.url),
      });
   }, [data]);

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <input type="hidden" name="id" value={form?.id || ""} />
         <div className="grid md:grid-cols-2 gap-4">
            <InputImage
               name="images"
               label="Destination Images"
               value={form?.images || []}
               setValue={setForm}
               multiple={true}
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
               disabled={loading}
               onClick={() => navigate("/destinasi")}
            >
               Batal
            </Button>
            <Button disabled={loading}>
               {loading ? "Menyimpan..." : "Simpan"}
            </Button>
         </div>
      </form>
   );

   async function handleSubmit(e) {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      try {
         const result = await action(formData);

         if (result.success) {
            toastAlert("success", "Destinasi berhasil disimpan.");
            navigate("/destinasi");
         } else {
            setErrors(result.errors || {});
            toastAlert("error", "Destinasi gagal disimpan.");
            setLoading(false);
            console.log("Errors:", result.errors);
         }
      } catch (error) {
         console.log("Gagal:", error);
      } finally {
         setLoading(false);
      }
   }
}
