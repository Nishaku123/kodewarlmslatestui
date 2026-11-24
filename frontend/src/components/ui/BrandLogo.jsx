/**
 * Kodewar brand lockup used in headers and authentication screens.
 * The image lives in frontend/public so Vite serves it at /kodewar-mark.png.
 */
export default function BrandLogo({ compact = false }) {
  return (
    <div className={compact ? "flex items-center gap-2.5" : "flex items-center gap-3.5"}>
      <span
        className={`flex ${
          compact ? "h-10 w-10" : "h-[52px] w-[52px]"
        } items-center justify-center rounded-full bg-[#071d3c] ring-1 ring-[#ffc21b]/70 shadow-[0_0_18px_rgba(27,113,216,0.28)]`}
      >
        <img
          src="/kodewar-mark.png"
          alt=""
          width="44"
          height="44"
          className={compact ? "h-8 w-8 object-contain" : "h-11 w-11 object-contain"}
        />
      </span>
      <span className="leading-none">
        {compact ? (
          <img
            src="/kodewar-wordmark-white.png"
            alt="Kodewar"
            width="301"
            height="29"
            className="h-auto w-[120px] object-contain"
          />
        ) : (
          <span className="block font-display text-[21px] font-bold tracking-[0.12em] text-white">
            KODEWAR
          </span>
        )}
        <span
          className={`mt-1.5 block ${
            compact ? "text-[8px]" : "text-[10px]"
          } font-semibold uppercase tracking-[0.34em] text-brand-300`}
        >
          LMS
        </span>
      </span>
    </div>
  );
}
