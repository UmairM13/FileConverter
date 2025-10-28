import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  MAX_UPLOAD_MB: z.coerce.number().min(1).max(1024).default(50),
  TMP_DIR: z.string().default("./tmp")
});

export type Env = z.infer<typeof schema>;
export const env: Env = schema.parse(process.env);
