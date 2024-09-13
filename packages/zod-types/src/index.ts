import zod from "zod";

export const userSigninSchema = zod.object({
    number: zod.string().min(10).max(10),
    password: zod.string().min(8)
});

export type UserSigninSchema = zod.infer<typeof userSigninSchema>;