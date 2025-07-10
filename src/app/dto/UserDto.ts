import * as z from "zod/v4"

export const UserRegisterSchema = z.object({
    username: z.string().min(1, "Username is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const UserLoginSchema = z.object({
    username: z.string(),
    password: z.string()
});

export interface UserInfoDto {
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    password_hash: string
}

export const UsernameSchema = z.object({
    username: z.string(),
});

export type UsernameDto = z.infer<typeof UsernameSchema>
export type UserLoginDto = z.infer<typeof UserLoginSchema>
export type UserRegisterDto = z.infer<typeof UserRegisterSchema>;

