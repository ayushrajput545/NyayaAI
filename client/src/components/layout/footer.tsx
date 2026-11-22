import Link from "next/link";
import { ArrowUpRight, Scale } from "lucide-react";
import { GITHUB_REPOSITORY_URL } from "@/lib/site-config";

const datasets = [
  { label: "Supreme Court of India", href: "https://www.sci.gov.in/" },
  { label: "India Code", href: "https://www.indiacode.nic.in/" },
  { label: "eCourts", href: "https://ecourts.gov.in/" },
];

function Footer() {
  return (
    <footer
      className="scroll-mt-24 border-t border-slate-800 bg-slate-950 text-slate-300"
      id="about"
    >
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-14 sm:px-10 lg:px-12 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1.2fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              aria-label="NyayaAI home"
              className="inline-flex items-center gap-2.5 text-white"
              href="/#home"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
                <Scale aria-hidden="true" className="size-[18px]" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Nyaya<span className="text-blue-300">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              A clearer way to explore Indian legal documents with
              multilingual AI-powered research.
            </p>
            {GITHUB_REPOSITORY_URL ? (
              <a
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                href={GITHUB_REPOSITORY_URL}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            ) : (
              <span
                aria-label="GitHub link coming soon"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400"
              >
                GitHub
                <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  Coming soon
                </span>
              </span>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="footer-link" href="/#home">
                  Home
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/#how-it-works">
                  How It Works
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/#about">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Research modes</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link className="footer-link" href="/workspace">
                  Quick Search
                </Link>
              </li>
              <li>
                <Link className="footer-link" href="/workspace">
                  Deep Research
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Research sources</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {datasets.map(({ label, href }) => (
                <li key={href}>
                  <a
                    className="footer-link inline-flex items-center gap-1.5"
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {label}
                    <ArrowUpRight aria-hidden="true" className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© NyayaAI. All rights reserved.</p>
          <p>Made for clearer legal research.</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
