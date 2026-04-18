"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button, Card, Spinner } from "@heroui/react";

type AuthFormTemplateProps = {
  title: string;
  description: string;
  onSubmit: (event: SubmitEvent) => void;
  loading: boolean;
  submitText: string;
  loadingText: string;
  error?: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkText: string;
  children: ReactNode;
};

export function AuthFormTemplate({
  title,
  description,
  onSubmit,
  loading,
  submitText,
  loadingText,
  error,
  footerText,
  footerLinkHref,
  footerLinkText,
  children,
}: AuthFormTemplateProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <Card className="w-full max-w-md border border-zinc-200 bg-background/70 dark:border-zinc-800 overflow-auto">
        <Card.Header className="block px-8 pt-8 pb-0">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </Card.Header>

        <Card.Content className="px-8 py-6">
          <form
            onSubmit={(e) => onSubmit(e as unknown as SubmitEvent)}
            className="flex flex-col gap-4"
          >
            {children}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button
              type="submit"
              isPending={loading}
              variant="primary"
              className="w-full"
              size="lg"
            >
              {({ isPending }) => (
                <>
                  {isPending && <Spinner color="current" size="sm" />}
                  {isPending ? loadingText : submitText}
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
            >
              {footerLinkText}
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
