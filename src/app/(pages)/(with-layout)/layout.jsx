import WebLayout from "@/components/layout/web";
import { getUser } from "@/lib/session";

export default async function Layout({ children }) {
   const user = await getUser();

   return <WebLayout user={user}>{children}</WebLayout>;
}
