"use client";

import { useState } from "react";
import { Input, Label } from "@heroui/react";
import { AuthFormTemplate } from "@/views/pages/auth/AuthFormTemplate";
import { useRouter } from "next/navigation";
import { useAuthClient } from "@/views/providers/useAuthCient";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuthClient();

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    if (signUpError) {
      setError(signUpError.message || "Gagal mendaftar. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push("/");
    setLoading(false);
  };

  return (
    <AuthFormTemplate
      title="Daftar"
      description="Buat akun Anda untuk memulai."
      onSubmit={(event) => handleSubmit(event as unknown as SubmitEvent)}
      loading={loading}
      submitText="Daftar"
      loadingText="Sedang membuat akun..."
      error={error}
      footerText="Sudah punya akun?"
      footerLinkHref="/login"
      footerLinkText="Masuk"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nama</Label>
        <Input
          placeholder="Masukkan nama lengkap Anda"
          type="text"
          autoComplete="name"
          required
          className="h-12"
          variant="secondary"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          placeholder="Masukkan email Anda"
          type="email"
          autoComplete="email"
          required
          className="h-12"
          variant="secondary"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          placeholder="Buat kata sandi"
          type="password"
          autoComplete="new-password"
          required
          className="h-12"
          variant="secondary"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
    </AuthFormTemplate>
  );
}
