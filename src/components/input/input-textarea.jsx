"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function InputTextarea({
  name,
  label,
  placeholder = label,
  value = "",
  setValue,
  errors,
  hint,
  className,
  disabled,
}) {
  const hasErrors = errors?.[name]?.length > 0;
  const errorMessage = errors?.[name]?.[0] ?? "";

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (setValue) {
      setValue((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label htmlFor={name}>{label}</Label>}

      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value?.toString() ?? ""}
        onChange={handleChange}
        aria-invalid={hasErrors}
        readOnly={disabled}
        className={cn(disabled && "bg-muted opacity-60")}
      />

      {hasErrors && (
        <p
          id={`${name}-error`}
          className={cn("text-sm", {
            "text-destructive": errorMessage,
            "text-muted-foreground": hint,
          })}
        >
          {errorMessage || hint}
        </p>
      )}
    </div>
  );
}
