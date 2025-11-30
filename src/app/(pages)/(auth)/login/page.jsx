import { withMetadata } from "@/lib/metadata";
import Form from "./form";

export const generateMetadata = withMetadata("Login");

export default function Page() {
   return <Form />;
}
