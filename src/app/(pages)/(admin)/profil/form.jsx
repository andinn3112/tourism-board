"use client";
import { InputText } from "@/components/input";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Form({ data }) {
  const [form, setForm] = useState(data);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setForm(data);
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative">
        <div className="flex flex-col gap-4">
          <InputText
            label="Nama"
            placeholder="Nama"
            name="name"
            value={form?.name}
            setValue={setForm}
            errors={errors}
          />
          <InputText
            label="Email"
            placeholder="email@web.com"
            name="email"
            value={form?.email}
            setValue={setForm}
            errors={errors}
          />
          <InputText
            label="Password"
            type="password"
            name="password"
            value={form?.password}
            setValue={setForm}
            errors={errors}
          />
        </div>

        <Button>Simpan</Button>
      </form>
    </div>
  );
}
