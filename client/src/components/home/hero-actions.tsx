"use client";

import { ArrowRight, LoaderCircle, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

function HeroActions() {
  const { status } = useAuth();

  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <Button asChild size="lg">
        <Link href="/workspace">
          Try it Now
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Button>
      {status === "loading" ? (
        <Button disabled size="lg" variant="outline">
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          Loading...
        </Button>
      ) : status === "authenticated" ? (
        <Button asChild size="lg" variant="outline">
          <Link href="/documents">
            <Upload aria-hidden="true" className="size-4" />
            Upload Document
          </Link>
        </Button>
      ) : (
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  );
}

export { HeroActions };
