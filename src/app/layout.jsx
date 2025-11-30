import { Poppins } from "next/font/google";
import "./globals.css";

import RootProvider from "@/provider/root";
import { getSiteMetadata } from "@/lib/metadata";

const poppins = Poppins({
   subsets: ["latin"],
   variable: "--font-poppins",
   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata() {
   return await getSiteMetadata();
}

export default async function Layout({ children }) {
   return (
      <html
         lang="id"
         suppressHydrationWarning
         className="scroll-smooth"
         data-scroll-behavior="smooth"
      >
         <body className={`${poppins.variable}`}>
            <RootProvider>{children}</RootProvider>
         </body>
      </html>
   );
}
