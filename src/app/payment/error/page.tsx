import Link from "next/link";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">❌</div>

        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Ödəniş uğursuz oldu
        </h1>

        <p className="text-gray-600 mb-8">
          Kartdan ödəniş həyata keçirilmədi. Yenidən cəhd edə bilərsiniz.
        </p>

        <Link
          href="/booking"
          className="inline-block rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition"
        >
          Yenidən cəhd et
        </Link>
      </div>
    </div>
  );
}
