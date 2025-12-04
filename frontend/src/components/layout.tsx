import type { PropsWithChildren } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="from-background to-muted bg-linear-to-br">
      <Header />
      <main className="container mx-auto min-h-screen px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
