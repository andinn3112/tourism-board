import { z } from "zod";

export const requiredField = (field, min = 1) => {
   return z.preprocess(
      (v) => (v === undefined || v === null ? "" : v),
      z.string().min(min, {
         message: `${field} wajib diisi ${
            min > 1 ? `minimal ${min} karakter` : ""
         }`,
      })
   );
};
