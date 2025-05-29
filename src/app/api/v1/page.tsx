import React from "react";
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start">
        <h1 className="text-2xl font-bold">API v1</h1>
        <p className="text-lg">This is the API v1 page.</p>
      </main>
    </div>
  );
}