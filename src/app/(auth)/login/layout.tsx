import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Student Login | Rhythmzz Academy",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
