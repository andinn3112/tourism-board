import { withMetadata } from "@/lib/metadata";
import Form from "./form";

export const generateMetadata = withMetadata("Profil User");

export default function Page() {
   return <Form />;
}
