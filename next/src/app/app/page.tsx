import { NavigationTitle } from "@/components/ui/NavigationTitle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center  font-sans ">
      <NavigationTitle title="Beranda" subtitle="Menu ada di kiri" />
      <main className="flex min-h-[75dvh] w-full max-w-3xl flex-col items-center justify-between py-32 px-16  sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Challenge Fullstack (Typescript)
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Web simple untuk penjadwalan agenda pada ruangan.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
            href="https://github.com/Raruu/dot-fullstack-batch-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="invert dark:invert-0"
              src="/Octicons-mark-github.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Repository
          </a>
        </div>
      </main>
    </div>
  );
}
