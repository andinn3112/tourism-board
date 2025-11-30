import { getUser } from "@/lib/session";
import Form from "./form";

export default async function Page() {
  const user = await getUser();
  return <Form data={user} />;
}
