import Link from "next/link";
import { Scale } from "lucide-react";
import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  footer: ReactNode;
}

function AuthPageLayout({
  children,
  description,
  eyebrow,
  title,
  footer,
}: AuthPageLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col bg-[#f7f8fa]">
      <header className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link
          aria-label="NyayaAI home"
          className="inline-flex items-center gap-2.5"
          href="/"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Scale aria-hidden="true" className="size-[18px]" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-950">
            Nyaya<span className="text-blue-800">AI</span>
          </span>
        </Link>
        <Link
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          href="/"
        >
          Back to home
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 sm:py-14">
        <section className="w-full max-w-[28rem] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-44px_rgba(15,35,67,0.28)] sm:p-9">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-800">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
          {children}
          <div className="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            {footer}
          </div>
        </section>
      </div>

      <footer className="px-6 pb-6 text-center text-xs text-slate-400">
        NyayaAI · Legal research &amp; document intelligence
      </footer>
    </main>
  );
}

export { AuthPageLayout };
