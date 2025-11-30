"use client";
import { useRouter } from "nextjs-toploader/app";

export function useNavigate() {
   const router = useRouter();

   function navigate(url, method = "push") {
      router[method](url);
   }

   return navigate;
}
