"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X, Plus } from "lucide-react";

export default function OptionsSelect({
   name,
   label,
   placeholder = "Pilih atau buat opsi...",
   value = "",
   setValue,
   options = [],
   errors,
   hint,
   className,
   disabled,
   onCreateOption,
}) {
   const [isOpen, setIsOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [filteredOptions, setFilteredOptions] = useState(options);
   const [isCreating, setIsCreating] = useState(false);
   const dropdownRef = useRef(null);
   const inputRef = useRef(null);

   const hasErrors = !!errors?.[name]?.length;
   const errorMessage = errors?.[name]?.[0] ?? "";

   // Filter options berdasarkan search term
   useEffect(() => {
      if (searchTerm.trim() === "") {
         setFilteredOptions(options);
      } else {
         const filtered = options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
         );
         setFilteredOptions(filtered);
      }
   }, [searchTerm, options]);

   // Close dropdown ketika klik di luar
   useEffect(() => {
      function handleClickOutside(event) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
         ) {
            setIsOpen(false);
            setSearchTerm("");
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const selectedOption = options.find((opt) => opt.value === value);

   const handleSelect = (optionValue, optionLabel) => {
      if (setValue) {
         setValue((prev) => ({
            ...prev,
            [name]: optionValue,
         }));
      }
      setIsOpen(false);
      setSearchTerm("");
   };

   const handleCreate = async () => {
      if (!onCreateOption || !searchTerm.trim()) return;

      setIsCreating(true);
      try {
         const newOption = await onCreateOption(searchTerm.trim());
         if (newOption && newOption.value) {
            handleSelect(newOption.value, newOption.label);
         }
      } catch (error) {
         console.error("Error creating option:", error);
      } finally {
         setIsCreating(false);
         setSearchTerm("");
      }
   };

   const clearSelection = () => {
      if (setValue) {
         setValue((prev) => ({
            ...prev,
            [name]: "",
         }));
      }
      setSearchTerm("");
   };

   const showCreateButton =
      searchTerm.trim() &&
      !filteredOptions.some(
         (opt) => opt.label.toLowerCase() === searchTerm.toLowerCase()
      );

   return (
      <div className={cn("space-y-1", className)}>
         <Label htmlFor={name}>{label}</Label>

         <div className="relative" ref={dropdownRef}>
            {/* Input Trigger */}
            <input type="hidden" name={name} value={value} />
            <div
               className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md bg-input/30 border-input",
                  "ring-offset-background placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  hasErrors && "border-destructive focus:ring-destructive",
                  disabled && "bg-muted opacity-60 cursor-not-allowed"
               )}
               onClick={() => !disabled && setIsOpen(!isOpen)}
            >
               <div className="flex items-center gap-2 flex-1">
                  {selectedOption ? (
                     <>
                        <span className="flex-1">{selectedOption.label}</span>
                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="h-4 w-4 p-0 hover:bg-transparent"
                           onClick={(e) => {
                              e.stopPropagation();
                              clearSelection();
                           }}
                        >
                           <X className="h-3 w-3" />
                        </Button>
                     </>
                  ) : (
                     <span className="text-muted-foreground">
                        {placeholder}
                     </span>
                  )}
               </div>
               <ChevronDown
                  className={cn(
                     "h-4 w-4 text-muted-foreground transition-transform",
                     isOpen && "rotate-180"
                  )}
               />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
               <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                  {/* Search Input */}
                  <div className="p-2 border-b">
                     <Input
                        ref={inputRef}
                        placeholder="Cari opsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8"
                        onClick={(e) => e.stopPropagation()}
                     />
                  </div>

                  {/* Options List */}
                  <div className="py-1">
                     {filteredOptions.map((option, i) => (
                        <div
                           key={i}
                           className={cn(
                              "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer",
                              "hover:bg-accent hover:text-accent-foreground",
                              value === option.value &&
                                 "bg-accent text-accent-foreground"
                           )}
                           onClick={() =>
                              handleSelect(option.value, option.label)
                           }
                        >
                           {value === option.value && (
                              <Check className="h-4 w-4" />
                           )}
                           <span className="flex-1">{option.label}</span>
                        </div>
                     ))}

                     {/* Create New Option */}
                     {showCreateButton && (
                        <div
                           className={cn(
                              "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer",
                              "hover:bg-accent hover:text-accent-foreground",
                              isCreating && "opacity-50 cursor-not-allowed"
                           )}
                           onClick={handleCreate}
                        >
                           <Plus className="h-4 w-4" />
                           <span>
                              {isCreating
                                 ? "Membuat..."
                                 : `Buat "${searchTerm}"`}
                           </span>
                        </div>
                     )}

                     {filteredOptions.length === 0 && !showCreateButton && (
                        <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                           Tidak ada opsi ditemukan
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* Error Message */}
         {hasErrors && (
            <p id={`${name}-error`} className="text-sm text-destructive">
               {errorMessage}
            </p>
         )}

         {/* Hint */}
         {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
   );
}
