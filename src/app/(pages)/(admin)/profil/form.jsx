"use client";
import { InputText } from "@/components/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { action } from "./action";
import { toastAlert } from "@/lib/utils";

export default function Form({ data }) {
   const [form, setForm] = useState(data);
   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      setForm(data);
   }, [data]);

   return (
      <div className="mx-auto w-full max-w-lg">
         <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative">
            <div className="flex flex-col gap-4">
               <InputText
                  label="Nama"
                  placeholder="Nama"
                  name="name"
                  value={form?.name}
                  setValue={setForm}
                  errors={errors}
               />
               <InputText
                  label="Email"
                  placeholder="email@web.com"
                  name="email"
                  value={form?.email}
                  setValue={setForm}
                  errors={errors}
               />
               <InputText
                  label="Password"
                  type="password"
                  name="password"
                  value={form?.password}
                  setValue={setForm}
                  errors={errors}
               />
            </div>

            <Button>Simpan</Button>
         </form>
      </div>
   );

   async function handleSubmit(e) {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(e.currentTarget);

      try {
         const result = await action(formData);

         if (result.success) {
            toastAlert("success", "Profil berhasil diperbarui.");
         } else {
            setErrors(result.errors || {});
            toastAlert(
               "error",
               "Gagal memperbarui profil. Periksa kesalahan pada formulir."
            );
         }
      } catch (error) {
         console.log("Gagal:", error);
         setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
      } finally {
         setLoading(false);
      }
   }
}
