import PublicTripView from "@/components/PublicTripView";

type PublicTrackingPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function PublicTrackingPage({ params }: PublicTrackingPageProps) {
  const { token } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Tracking publico</h1>
        <p className="text-sm text-zinc-500">Token: {token}</p>
      </header>
      <PublicTripView token={token} />
    </main>
  );
}
