import MapView from "@/components/MapView";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">GPS MVP</h1>
        <p className="text-sm text-zinc-500">Next.js + TypeScript + Firebase + Leaflet</p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <MapView />
      </section>
    </main>
  );
}
