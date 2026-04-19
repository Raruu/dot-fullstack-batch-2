"use client";

import { useState } from "react";
import { Checkbox, Input } from "@heroui/react";
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
      description="Masuk untuk melanjutkan ke aplikasi."
      onSubmit={(e) => handleSubmit(e as unknown as SubmitEvent)}
      loading={loading}
      submitText="Masuk"
      loadingText="Sedang masuk..."
      error={error}
      footerText="Belum punya akun?"
      footerLinkHref="/register"
      footerLinkText="Daftar"
    >
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
        placeholder="Masukkan kata sandi Anda"
        type="password"
        autoComplete="current-password"
        size="lg"
        isRequired
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <Checkbox isSelected={rememberMe} onValueChange={setRememberMe}>
        Ingat saya
      </Checkbox>
    </AuthFormTemplate>
  );
}
