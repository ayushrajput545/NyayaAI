import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Research Workspace | NyayaAI",
  description:
    "Research Indian legal documents with NyayaAI's source-grounded Quick Search and Deep Research.",
};

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
