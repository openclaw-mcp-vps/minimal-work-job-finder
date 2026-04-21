import { UnlockForm } from "@/components/UnlockForm";

interface UnlockPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function UnlockPage({ searchParams }: UnlockPageProps) {
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/jobs";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12 sm:px-8">
      <UnlockForm nextPath={nextPath} />
    </main>
  );
}
