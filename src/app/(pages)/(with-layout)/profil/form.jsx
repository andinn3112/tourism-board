"use client";
import { InputText } from "@/components/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { action } from "./action";
import { toastAlert } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { Loader2 } from "lucide-react";

export default function Form() {
   const { user, setUser } = useAuthStore();
   const [form, setForm] = useState();
   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      setForm(user);
   }, [user]);

   return (
      <div className="mx-auto w-full max-w-sm p-4 pb-20">
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

            <Button disabled={loading}>
               Simpan {loading && <Loader2 className="animate-spin" />}{" "}
            </Button>
         </form>
      </div>
   );

   async function handleSubmit(e) {
      e.preventDefault();
      setLoading(true);

      try {
         const result = await action(form);

         if (result.success) {
            setUser(result.data);
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
