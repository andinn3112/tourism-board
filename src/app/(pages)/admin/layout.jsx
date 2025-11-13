import AdminLayout from "@/components/layout/admin";
import { getUser } from "@/lib/session";

export default async function Layout({ children }) {
   const user = await getUser();

   return <AdminLayout user={user}>{children}</AdminLayout>;
}
