import { z } from "zod";
import { createUserSchema } from "./create-user-schema";

export const updateUserSchema = createUserSchema.extend({
  id: z.string().trim().min(1, "ID user tidak valid."),
});
