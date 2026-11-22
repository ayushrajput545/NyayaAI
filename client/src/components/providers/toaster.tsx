"use client";

import { Toaster as SonnerToaster } from "sonner";

function Toaster() {
  return (
    <SonnerToaster
      closeButton
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          description: "text-slate-600",
          title: "font-medium",
        },
      }}
    />
  );
}

export { Toaster };
