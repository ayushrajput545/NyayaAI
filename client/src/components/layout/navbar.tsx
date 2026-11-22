"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12"
      >
        <Link
          aria-label="NyayaAI home"
          className="inline-flex items-center gap-2.5"
          href="/#home"
          onClick={closeMenu}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Scale aria-hidden="true" className="size-[18px]" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-950">
            Nyaya<span className="text-blue-800">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-800"
            href="/#home"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-800"
            href="/#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-800"
            href="/#about"
          >
            About
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link href="/login">
              Login
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          </Button>
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="flex size-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          {isOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </nav>
      {isOpen ? (
        <div
          className="border-t border-slate-100 bg-white px-6 py-4 md:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              href="/#home"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              href="/#how-it-works"
              onClick={closeMenu}
            >
              How It Works
            </Link>
            <Link
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              href="/#about"
              onClick={closeMenu}
            >
              About
            </Link>
            <Button asChild className="mt-2 w-full" variant="outline">
              <Link href="/login" onClick={closeMenu}>
                Login
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export { Navbar };
