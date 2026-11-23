import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  Check,
  FileText,
  Lightbulb,
  MessageCircleQuestion,
  Play,
  Search,
  Upload,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { HeroActions } from "@/components/home/hero-actions";
import { Card } from "@/components/ui/card";
import {
  getYouTubeEmbedUrl,
  YOUTUBE_WALKTHROUGH_URL,
} from "@/lib/site-config";

const steps = [
  {
    icon: Upload,
    title: "Upload Documents",
    description: "Bring legal PDFs and documents into one focused workspace.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask Questions",
    description: "Ask in English or Hindi, using the language that feels natural.",
  },
  {
    icon: Search,
    title: "AI Research",
    description: "Find relevant legal passages with intelligent search.",
  },
  {
    icon: Lightbulb,
    title: "Get Insights",
    description: "Receive context-grounded answers with source references.",
  },
];

const walkthroughEmbedUrl = getYouTubeEmbedUrl(YOUTUBE_WALKTHROUGH_URL);

function ResearchIllustration() {
  return (
    <div
      aria-label="Illustration of a legal research question, answer and source"
      className="relative mx-auto w-full max-w-[34rem]"
      role="img"
    >
      <div className="absolute -left-8 top-10 size-28 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="absolute -right-4 bottom-8 size-36 rounded-full bg-slate-200/70 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_80px_-40px_rgba(15,35,67,0.3)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <BookOpenCheck aria-hidden="true" className="size-[18px]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Legal research
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                A clearer path to context
              </p>
            </div>
          </div>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-800">
            English · हिंदी
          </span>
        </div>

        <div className="space-y-5 bg-[#fbfcfe] p-5 sm:p-6">
          <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-slate-900 px-4 py-3.5 text-sm leading-6 text-white shadow-sm">
            How have courts interpreted the right to privacy in India?
          </div>

          <div className="max-w-[94%] rounded-2xl rounded-tl-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-800">
              <span className="flex size-6 items-center justify-center rounded-full bg-blue-50">
                <BookOpenCheck aria-hidden="true" className="size-3.5" />
              </span>
              AI-generated response
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Explore relevant judgments and passages together. NyayaAI
              organizes the source material so you can follow the reasoning
              behind each result.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                <FileText aria-hidden="true" className="size-3.5" />
                Source reference
              </span>
              <span className="text-xs text-slate-400">
                Review the original text
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                <Search aria-hidden="true" className="size-4" />
              </span>
              <span className="text-xs text-slate-500">
                Search across legal documents
              </span>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="size-4 text-slate-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400 sm:px-6">
          <Check aria-hidden="true" className="size-3.5 text-emerald-600" />
          Illustrative preview · Verify sources independently
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section
          className="mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-16 sm:px-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-24"
          id="home"
        >
          <div className="max-w-2xl motion-safe:animate-rise-in">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold tracking-wide text-slate-600 shadow-sm">
              <span className="size-1.5 rounded-full bg-blue-700" />
              AI-Powered Indian Legal Research
            </div>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.25rem]">
              Legal Research,
              <br />
              <span className="text-blue-800">Made Smarter.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Explore Indian legal documents with multilingual,
              AI-powered research. Ask in English or Hindi, follow the sources,
              and spend more time on the questions that matter.
            </p>
            <HeroActions />
            <a
              className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-800"
              href="#how-it-works"
            >
              See how it works
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
          <div className="motion-safe:animate-rise-in motion-safe:[animation-delay:120ms]">
            <ResearchIllustration />
          </div>
        </section>

        <section
          aria-labelledby="how-it-works-title"
          className="scroll-mt-24 border-y border-slate-200/80 bg-white"
          id="how-it-works"
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-800">
                How it works
              </p>
              <h2
                className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl"
                id="how-it-works-title"
              >
                From documents to understanding.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                A simple, connected process to help make legal research more
                approachable.
              </p>
            </div>

            <div className="relative mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5 xl:after:absolute xl:after:left-[12.5%] xl:after:right-[12.5%] xl:after:top-12 xl:after:h-px xl:after:bg-slate-200 xl:after:content-['']">
              {steps.map(({ icon: Icon, title, description }, index) => (
                <Card
                  className="relative z-10 rounded-2xl border-slate-200/90 p-5 shadow-none transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_36px_-26px_rgba(15,35,67,0.3)] sm:p-6"
                  key={title}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-xl border-4 border-white bg-blue-50 text-blue-800 shadow-[0_0_0_1px_#dbe4f0]">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="text-xs font-semibold tracking-[0.1em] text-slate-400">
                      STEP 0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-20 grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-800">
                  A closer look
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  See NyayaAI in Action
                </h3>
                <p className="mt-4 max-w-md leading-7 text-slate-600">
                  Watch how NyayaAI simplifies legal research.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-[0_22px_60px_-40px_rgba(15,35,67,0.42)]">
                {walkthroughEmbedUrl ? (
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="aspect-video w-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src={walkthroughEmbedUrl}
                    title="NyayaAI product walkthrough"
                  />
                ) : (
                  <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-center">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(49,90,145,0.3),transparent_58%)]" />
                    <span className="relative flex size-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-sm">
                      <Play
                        aria-hidden="true"
                        className="ml-0.5 size-5 fill-current"
                      />
                    </span>
                    <p className="relative mt-4 text-sm font-medium text-white">
                      Walkthrough coming soon
                    </p>
                    <p className="relative mt-1 text-xs text-slate-400">
                      A video preview will be available here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
