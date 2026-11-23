import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Document Library | NyayaAI",
  description:
    "Upload and manage your legal PDFs for research in the NyayaAI workspace.",
};

export default function DocumentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
