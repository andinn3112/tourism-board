"use client";
import { Button } from "@/components/ui/button";
import { action } from "./action";
import { InputText, InputTextarea } from "@/components/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Form({ data }) {
   const [form, setForm] = useState(data);
   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   useEffect(() => {
      setForm(data);
   }, [data]);

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="space-y-2">
            <input type="hidden" name="id" value={form?.id || ""} />
            <InputText
               label="Nama Destinasi"
               name="name"
               value={form?.name}
               setValue={setForm}
               errors={errors}
            />
            <InputTextarea
               label="Deskripsi"
               name="description"
               value={form?.description}
               setValue={setForm}
               errors={errors}
            />
            <InputText
               label="Alamat"
               name="address"
               value={form?.address}
               setValue={setForm}
               errors={errors}
            />
            <InputText
               label="Koordinat"
               name="coordinate"
               value={form?.coordinate}
               setValue={setForm}
               errors={errors}
            />
         </div>
         <Button disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
         </Button>
      </form>
   );

   async function handleSubmit(e) {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      try {
         const result = await action(formData);

         if (result.success) {
            router.replace("/destinasi");
         } else {
            setErrors(result.errors || {});
            setLoading(false);
         }
      } catch (error) {
         console.log("Gagal:", error);
         setLoading(false);
      }
   }
}
