"use client";

import { useState } from "react";
import { Input } from "@heroui/react";
import { AuthFormTemplate } from "@/views/auth/AuthFormTemplate";
import { useRouter } from "next/navigation";
import { useAuthClient } from "@/providers/useAuthCient";

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
      <Input
        label="Nama"
        labelPlacement="outside"
        placeholder="Masukkan nama lengkap Anda"
        type="text"
        autoComplete="name"
        size="lg"
        isRequired
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <Input
        label="Email"
        labelPlacement="outside"
        placeholder="Masukkan email Anda"
        type="email"
        autoComplete="email"
        size="lg"
        isRequired
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Input
        label="Kata sandi"
        labelPlacement="outside"
        placeholder="Buat kata sandi"
        type="password"
        autoComplete="new-password"
        size="lg"
        isRequired
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
    </AuthFormTemplate>
  );
}
