import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Toaster } from "sonner";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
        <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default Providers;
