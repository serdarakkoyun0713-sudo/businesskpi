import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#0D0F14" }}
    >
      {/* Background decorative blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          left: "-5%",
          width: "50vw",
          height: "50vw",
          maxWidth: 600,
          maxHeight: 600,
          background: "radial-gradient(circle, rgba(67,97,238,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "0%",
          right: "-5%",
          width: "40vw",
          height: "40vw",
          maxWidth: 500,
          maxHeight: 500,
          background: "radial-gradient(circle, rgba(114,9,183,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40%",
          right: "10%",
          width: "20vw",
          height: "20vw",
          maxWidth: 300,
          maxHeight: 300,
          background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Logo size="lg" />
          {/* Tagline badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="badge-blue">Sipariş</span>
            <span className="badge-green">Ciro</span>
            <span className="badge-amber">Hedefler</span>
            <span className="text-text-disabled text-xs">→</span>
            <span className="text-text-muted text-xs font-medium">Tek panelde</span>
          </div>
        </div>

        {/* Form card */}
        {children}

        {/* Footer */}
        <p className="text-xs text-text-disabled text-center">
          Kişisel veriler güvende — Row Level Security aktif
        </p>
      </div>
    </div>
  );
}
