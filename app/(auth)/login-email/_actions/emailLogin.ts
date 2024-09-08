"use server";

import { signIn } from "@/auth";

export async function emailLogin(formData: FormData) {
  const email = formData.get("email") as string;

  try {
    await signIn("nodemailer", {
      email,
      redirect: false,
    });
  } catch (error) {
    throw error;
  }
}
