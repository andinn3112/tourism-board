"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

export function ToggleTheme() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   const toggleSwitch = () => {
      setTheme(theme === "light" ? "dark" : "light");
   };

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return (
         <Button variant="ghost" disabled>
            <Spinner />
         </Button>
      );
   }

   return (
      <Button variant="ghost" size="icon" onClick={toggleSwitch}>
         {theme == "light" ? (
            <SunIcon className="text-primary" />
         ) : (
            <MoonIcon />
         )}
         <span className="sr-only">Toggle theme</span>
      </Button>
   );
}
