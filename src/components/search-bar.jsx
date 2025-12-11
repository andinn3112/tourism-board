"use client";

import { CornerDownRightIcon, SearchIcon } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "@/hooks/use-navigate";

export default function SearchBar({
  placeholder = "Cari destinasi...",
  autoFocus = false,
  showQuickFilters = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    navigate(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-xs">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full pl-12 pr-12 py-3 border rounded-full focus:border-primary/40 focus:ring-2 focus:ring-primary/40 focus:outline-none duration-300"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-15 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground/60"
            >
              ✕
            </button>
          )}

          <Button
            size="icon"
            variant="outline"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
          >
            <CornerDownRightIcon />
          </Button>
        </div>
      </form>
    </div>
  );
}
