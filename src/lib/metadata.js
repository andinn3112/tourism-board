import { BASE_URL, SITE_DESCRIPTION, SITE_NAME } from "./env";
import prisma from "./prisma";

export function withMetadata(pageTitle) {
   return async function generateMetadata({ params }, parent) {
      const parentMetadata = await parent;
      const title =
         typeof pageTitle === "function" ? pageTitle(await params) : pageTitle;

      return {
         title,
         openGraph: {
            ...parentMetadata?.openGraph,
            title,
         },
         twitter: {
            ...parentMetadata?.twitter,
            title,
         },
      };
   };
}

export async function getSiteMetadata() {
   const siteName = SITE_NAME;
   const siteDesc = SITE_DESCRIPTION;
   const siteUrl = BASE_URL;
   const siteImage = `${siteUrl}/images/logo.png`;

   return {
      title: {
         default: siteName,
         template: `%s | ${siteName}`,
      },
      description: siteDesc,
      openGraph: {
         title: siteName,
         description: siteDesc,
         type: "website",
         siteName,
         url: siteUrl,
         images: [
            {
               url: siteImage,
               width: 1200,
               height: 630,
               alt: siteName,
            },
         ],
      },
      twitter: {
         card: "summary_large_image",
         title: siteName,
         description: siteDesc,
         images: [siteImage],
      },
      canonical: siteUrl,
   };
}

export async function getDestinationMetadata(slug) {
   const data = await prisma.destinasi.findUnique({
      where: { slug },
   });

   if (!data) {
      return {
         title: "Destinasi tidak ditemukan",
         description: "Halaman ini tidak tersedia",
      };
   }

   const siteUrl = BASE_URL;
   const siteName = SITE_NAME;
   const title = data.name;
   const description = data.description.slice(0, 150);
   const imageUrl = data.images[0]?.url || `${siteUrl}/images/logo.png`;

   return {
      title,
      description,
      openGraph: {
         title,
         description,
         type: "website",
         siteName,
         url: `${siteUrl}/destinasi/${data.slug}`,
         images: [
            {
               url: imageUrl,
               width: 1200,
               height: 630,
               alt: title,
            },
         ],
      },
      twitter: {
         card: "summary_large_image",
         title,
         description,
         images: [imageUrl],
      },
      canonical: `${siteUrl}/destinasi/${data.slug}`,
   };
}
