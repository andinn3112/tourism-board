"use client";

export default function WisataPage() {
  const dataRiau = [
    { id: 1, nama: "Pulau Rupat", lokasi: "Kab. Bengkalis" },
    { id: 2, nama: "Istana Siak Sri Indrapura", lokasi: "Siak" },
    { id: 3, nama: "Danau Buatan Lembah Sari", lokasi: "Pekanbaru" },
    { id: 4, nama: "Air Terjun Aek Martua", lokasi: "Rokan Hulu" },
    { id: 5, nama: "Bukit Tiga Puluh", lokasi: "Indragiri Hulu" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-green-700 text-center">
        Daftar Wisata di Riau
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {dataRiau.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md p-5 rounded-xl border border-gray-200"
          >
            <h2 className="text-lg font-semibold">{item.nama}</h2>
            <p className="text-gray-600 text-sm">{item.lokasi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
