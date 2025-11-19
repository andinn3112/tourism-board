"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function InputText({
   name,
   label,
   placeholder = label,
   value = "",
   setValue,
   errors,
   hint,
   className,
   disabled,
   type = "text",
}) {
   const hasErrors = !!errors?.[name]?.length;
   const errorMessage = errors?.[name]?.[0] ?? "";

   return (
      <div className={cn("space-y-1", className)}>
         <Label htmlFor={name}>{label}</Label>
         <Input
            name={name}
            type={type}
            placeholder={placeholder}
            value={value?.toString() ?? ""}
            onChange={handleChange}
            aria-invalid={hasErrors}
            readOnly={disabled}
            className={cn(disabled && "bg-muted opacity-60")}
         />
         {hasErrors && (
            <p id={`${name}-error`} className="text-sm text-destructive">
               {errorMessage}
            </p>
         )}
         {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
   );

   function handleChange(e) {
      const newValue = e.target.value;

      if (setValue) {
         setValue((prev) => ({
            ...prev,
            [name]: newValue,
         }));
      }
   }
}
