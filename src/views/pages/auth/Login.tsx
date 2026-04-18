"use client";

import { useState } from "react";
import { Checkbox, Input, Label } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AuthFormTemplate } from "@/views/pages/auth/AuthFormTemplate";
import { useAuthClient } from "@/views/providers/useAuthCient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuthClient();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/",
    });

    if (signInError) {
      setError(signInError.message || "Gagal masuk. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/");
    setLoading(false);
  };

  return (
    <AuthFormTemplate
      title="Masuk"
      description="Masuk untuk melanjutkan ke dashboard Anda."
      onSubmit={(e) => handleSubmit(e as unknown as SubmitEvent)}
      loading={loading}
      submitText="Masuk"
      loadingText="Sedang masuk..."
      error={error}
      footerText="Belum punya akun?"
      footerLinkHref="/register"
      footerLinkText="Daftar"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          placeholder="Masukkan email Anda"
          type="email"
          autoComplete="email"
          className="h-12"
          variant="secondary"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          placeholder="Masukkan kata sandi Anda"
          type="password"
          autoComplete="current-password"
          className="h-12"
          variant="secondary"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Checkbox
        id="remember-me"
        isSelected={rememberMe}
        onChange={setRememberMe}
      >
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Content>
          <Label htmlFor="remember-me">Ingat Saya</Label>
        </Checkbox.Content>
      </Checkbox>
    </AuthFormTemplate>
  );
}
