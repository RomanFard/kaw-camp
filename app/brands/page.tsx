"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-theme">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-theme">برندها</h1>
        <p className="mt-3 text-theme-muted">به زودی...</p>
      </div>
      <Footer />
    </main>
  );
}