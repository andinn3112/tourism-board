import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/env";
import Logo from "../logo";

export default function Footer({ categories = [] }) {
   const currentYear = new Date().getFullYear();
   return (
      <footer className="relative bg-linear-to-b from-zinc-900 to-zinc-950 text-white overflow-hidden">
         {/* Decorative elements */}
         <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-600 via-amber-300 to-red-800"></div>

         <div className="max-w-6xl w-full mx-auto px-4 py-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Brand Column */}
               <div className="lg:col-span-5">
                  <div className="flex gap-3 mb-6">
                     <div>
                        <Logo className="size-40" />
                        <h2 className="text-2xl font-bold bg-linear-to-r from-amber-400 to-amber-800 bg-clip-text text-transparent">
                           {SITE_NAME}
                        </h2>
                        <p className="text-sm text-gray-400">
                           {SITE_DESCRIPTION}
                        </p>
                     </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                     Jelajahi keindahan Riau. Temukan destinasi tersembunyi dan
                     pengalaman tak terlupakan.
                  </p>
                  <div className="flex gap-3">
                     {[
                        {
                           icon: Facebook,
                           color: "hover:bg-blue-600",
                           label: "Facebook",
                        },
                        {
                           icon: Twitter,
                           color: "hover:bg-sky-500",
                           label: "Twitter",
                        },
                        {
                           icon: Instagram,
                           color: "hover:bg-gradient-to-br from-purple-600 to-pink-600",
                           label: "Instagram",
                        },
                        {
                           icon: Youtube,
                           color: "hover:bg-red-600",
                           label: "YouTube",
                        },
                     ].map((social) => (
                        <a
                           key={social.label}
                           href="#"
                           className={`p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl ${social.color} transition-all hover:scale-110`}
                           aria-label={social.label}
                        >
                           <social.icon className="w-5 h-5" />
                        </a>
                     ))}
                  </div>
               </div>

               {/* Links Columns */}
               {[
                  {
                     title: "Destinasi",
                     links: categories.map((dt) => {
                        return {
                           label: dt.nama,
                           href: `/destinasi?kategori=${dt.slug}`,
                        };
                     }),
                  },
                  {
                     title: "Perusahaan",
                     links: [
                        { label: "Tentang Kami", href: "/tentang" },
                        { label: "Karier", href: "/karir" },
                        { label: "Blog", href: "/blog" },
                        { label: "Partner", href: "/partner" },
                        { label: "Press Kit", href: "/press" },
                     ],
                  },
                  {
                     title: "Bantuan",
                     links: [
                        { label: "FAQ", href: "/faq" },
                        { label: "Pusat Bantuan", href: "/bantuan" },
                        { label: "Kebijakan Privasi", href: "/privacy" },
                        { label: "Syarat Layanan", href: "/terms" },
                        { label: "Hubungi Kami", href: "/kontak" },
                     ],
                  },
               ].map((section, idx) => (
                  <div key={idx} className="lg:col-span-2">
                     <h3 className="text-lg font-semibold mb-6 text-primary">
                        {section.title}
                     </h3>
                     <ul className="space-y-3">
                        {section.links.map((link) => (
                           <li key={link.label}>
                              <Link
                                 href={link.href}
                                 className="text-gray-400 hover:text-amber-400 transition-colors group flex items-center gap-2"
                              >
                                 <span className="w-0 h-0.5 bg-amber-400 group-hover:w-3 transition-all"></span>
                                 {link.label}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t border-gray-800">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                     <span>
                        © {currentYear} {SITE_NAME}
                     </span>
                     <span className="hidden md:inline">•</span>
                     <span className="flex items-center gap-1">
                        Made with{" "}
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
                        in Indonesia
                     </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                     <Link
                        href="/privacy"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        Kebijakan Privasi
                     </Link>
                     <Link
                        href="/terms"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        Syarat Layanan
                     </Link>
                     <Link
                        href="/cookies"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        Pengaturan Cookies
                     </Link>
                     <Link
                        href="/sitemap"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        Peta Situs
                     </Link>
                  </div>
               </div>
            </div>
         </div>

         {/* Floating decoration */}
         <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
      </footer>
   );
}
