"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import githubLogin from "../_actions/githubLogin";

export default function LoginForm() {
  return (
    <Card className="mx-auto max-w-96">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Entre com o seu GitHub</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="text-left" action={githubLogin}>
          <Button size={"lg"} type="submit" className="w-full mt-10 flex gap-3">
            <Github />
            Login com o GitHib
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
