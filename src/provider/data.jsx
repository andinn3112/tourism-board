"use client";

import { useProfile } from "@/store/profile";
import { useEffect } from "react";

export default function DataProvider({ store, children }) {
   const { setData: setProfile } = useProfile();

   useEffect(() => {
      setProfile(store);
   }, [store]);

   return <>{children}</>;
}
