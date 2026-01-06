import WebLayout from "@/components/layout/web";
import { getCategories } from "@/lib/query";
import { getUser } from "@/lib/session";

export default async function Layout({ children }) {
   const [user, categories] = await Promise.all([getUser(), getCategories()]);

   return (
      <WebLayout user={user} categories={categories}>
         {children}
      </WebLayout>
   );
}
