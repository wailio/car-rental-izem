import type { Metadata } from "next";
import { LabGrid } from "./LabGrid";

export const metadata: Metadata = {
  title: "Lab — IZEM MOTORS",
  robots: { index: false, follow: false },
};

export default function LabIndexPage() {
  return <LabGrid />;
}
