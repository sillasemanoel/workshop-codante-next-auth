"use client";

import { useSession } from "next-auth/react";
import LoginForm from "./_components/login-form";
import { useRouter } from "next/navigation";

export default function LoginClientPage() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  return <LoginForm />;
}
