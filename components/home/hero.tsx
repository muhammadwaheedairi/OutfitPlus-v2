import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative h-[400px] sm:h-[550px] lg:h-[650px] bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('/hero.png')" }}
    >
      <div className="container mx-auto h-full flex items-center px-6 sm:px-10 lg:px-16">
        <div className="max-w-lg">
          <p className="text-[13px] sm:text-[15px] font-bold text-[#252B42] tracking-widest uppercase mb-3">
            WINTER 2026
          </p>
          <h1 className="text-[36px] sm:text-[52px] lg:text-[64px] font-extrabold text-[#252B42] leading-tight mb-5">
            NEW<br />COLLECTION
          </h1>
          <p className="text-[14px] sm:text-[16px] text-[#737373] leading-relaxed mb-8 max-w-xs">
            We know how large objects will act,<br />
            but things on a small scale.
          </p>
          <Link
            href="/product"
            className="inline-block px-10 py-4 bg-[#2DC071] text-white text-[14px] font-bold uppercase tracking-widest hover:bg-[#27a863] transition-colors"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
