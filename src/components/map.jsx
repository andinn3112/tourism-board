"use client";

export default function MapEmbed({
  coordinate,
  height = 400,
  className = "",
  title = "Peta lokasi",
}) {
  if (!coordinate) {
    return (
      <div
        className={`w-full flex items-center justify-center p-6 bg-slate-50 text-slate-500 ${className}`}
      >
        <p>Koordinat belum disediakan.</p>
      </div>
    );
  }

  const src = `https://maps.google.com/maps?q=${coordinate}&z=15&output=embed`;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <iframe
        title={title}
        src={src}
        width="500px"
        height="500px"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
