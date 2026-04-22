import { Card, CardBody, Spinner } from "@heroui/react";

interface LoadingScreenProps {
  title?: string;
  description?: string;
}

export function LoadingScreen({
  title = "Memuat halaman",
  description = "Tunggu sebentar, data sedang diambil.",
}: LoadingScreenProps) {
  return (
    <div className="flex w-full h-[75dvh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl bg-background/30">
        <CardBody className="flex flex-col items-center justify-center gap-4 px-8 py-14 text-center">
          <Spinner size="lg" color="primary" />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{title}</p>
            <p className="text-sm text-default-500">{description}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
