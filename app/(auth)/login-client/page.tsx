"use client";

import { useSession } from "next-auth/react";
import LoginForm from "./_components/login-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginClientPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return <LoginForm />;
}
