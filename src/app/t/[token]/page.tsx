import PublicTripView from "@/components/PublicTripView";

type PublicTrackingPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    truck?: string;
  }>;
};

export default async function PublicTrackingPage({
  params,
  searchParams,
}: PublicTrackingPageProps) {
  const { token } = await params;
  const { truck } = await searchParams;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[linear-gradient(180deg,#edf1f5,#d6dce6)]">
      <header className="flex h-11 items-center justify-between border-b border-[#b8c0ce] bg-[linear-gradient(180deg,#f7f9fc,#d5dbe7)] px-4">
        <strong className="text-sm text-[#1b2332]">IntiRoute | Tracking compartido</strong>
        <span className="text-xs uppercase tracking-[0.12em] text-[#5d6779]">Token {token}</span>
      </header>
      <div className="h-[calc(100vh-44px)] min-h-0">
        <PublicTripView token={token} truckPlate={truck} />
      </div>
    </main>
  );
}
