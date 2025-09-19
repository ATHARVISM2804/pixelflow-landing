import Link from "next/link";

export default function PanIndexPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <div className="bg-gray-900/70 rounded-xl shadow-lg p-10 flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold text-white mb-2">PAN Card Tools</h1>
        <div className="flex flex-col gap-4">
          <Link
            href="/pan1"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 text-center"
          >
            Go to PAN Card Tool 1
          </Link>
          <Link
            href="/pan2"
            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 text-center"
          >
            Go to PAN Card Tool 2
          </Link>
        </div>
      </div>
    </div>
  );
}
