"use client";

import { InputText } from "@/components/input";
import { LoaderSpinner } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { ClockIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { action } from "./action";
import { SITE_NAME } from "@/lib/env";
import Logo from "@/components/logo";
import { useNavigate } from "@/hooks/use-navigate";

export default function Form() {
   const [loading, setLoading] = useState(false);
   const [form, setForm] = useState({
      email: "",
      password: "",
   });
   const [errors, setErrors] = useState({});
   const navigate = useNavigate();

   return (
      <div className="flex h-screen w-screen flex-col justify-center items-center">
         <div className="max-w-sm w-full mx-auto bg-card border border-card shadow-lg rounded-lg relative py-5">
            <LoaderSpinner show={loading} />
            <div className="p-8 space-y-6">
               <div className="flex flex-col justify-center items-center gap-2">
                  <Link href="/">
                     <Logo />
                  </Link>
                  <div className="text-2xl font-semibold text-center text-primary">
                     {SITE_NAME}
                  </div>
                  <div className="text-muted-foreground text-center">
                     Silahkan masukkan kredensial anda
                  </div>
               </div>

               <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6 relative"
               >
                  <div className="flex flex-col gap-4">
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

                  <Button>
                     Login <LogInIcon className="size-4" />
                  </Button>
               </form>
            </div>
         </div>
      </div>
   );

   async function handleSubmit(e) {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      try {
         const result = await action(formData);

         if (result.success) {
            navigate("/");
         } else {
            setErrors(result.errors || {});
         }
      } catch (error) {
         console.log("Gagal:", error);
         setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
      } finally {
         setLoading(false);
      }
   }
}
