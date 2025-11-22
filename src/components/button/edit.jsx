"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { PencilIcon } from "lucide-react";

export default function EditButton({ link }) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return null;

  return (
    <Button onClick={() => router.push(link)}>
      <PencilIcon className="size-4" /> Edit
    </Button>
  );
}
