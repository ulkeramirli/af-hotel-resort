import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-6">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Ödəniş uğurla tamamlandı
        </h1>

        <p className="text-gray-600 mb-8">
          Rezervasiyanız qəbul edildi. Təsdiq emaili sizə qısa müddətdə
          göndəriləcək.
        </p>

        <Link
          href="/"
          className="inline-block rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 transition"
        >
          Ana səhifəyə qayıt
        </Link>
      </div>
    </div>
  );
}
