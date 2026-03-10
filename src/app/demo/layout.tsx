import type { ReactNode } from "react";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
