"use client";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

export default function RootProvider({ children }) {
   return (
      <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
      >
         <Toaster
            closeButton
            duration={1500}
            position="bottom-right"
            expand={true}
         />
         <NextTopLoader height={2} showSpinner={false} />
         {children}
      </ThemeProvider>
   );
}
