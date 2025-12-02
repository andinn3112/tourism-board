"use client";
import { Button } from "@/components/ui/button";
import { action } from "./action";
import { useState } from "react";
import { InputText, InputTextarea } from "@/components/input";
import { toastAlert } from "@/lib/utils";

export default function FormKomentar({ destinasiId }) {
   const [form, setForm] = useState({ destinasiId });
   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);
   return (
      <div className="space-y-6">
         <h2 className="text-lg">Komentar Anda</h2>
         <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
               <InputText
                  label="Nama"
                  name="nama"
                  value={form?.nama}
                  setValue={setForm}
                  errors={errors}
               />
               <InputText
                  label="Email"
                  name="email"
                  value={form?.email}
                  setValue={setForm}
                  errors={errors}
               />
               <InputTextarea
                  label="Komentar"
                  name="komentar"
                  value={form?.komentar}
                  setValue={setForm}
                  errors={errors}
               />
            </div>
            <Button disabled={loading}>{loading ? "Mengirim" : "Kirim"}</Button>
         </form>
      </div>
   );
   async function submit(e) {
      e.preventDefault();
      setLoading(true);
      const res = await action(form);

      if (!res.success) {
         setErrors(res.errors);
         toastAlert("error", "Komentar gagal dikirim");
         setLoading(false);
         return;
      }

      toastAlert("success", "Komentar berhasil dikirim");
      setForm({ destinasiId });
      setErrors({});
      setLoading(false);
   }
}
