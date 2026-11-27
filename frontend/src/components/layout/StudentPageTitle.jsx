export default function StudentPageTitle({
  title,
  accent = title,
  className = "mt-3",
}) {
  const highlightedText = title.endsWith(accent) ? accent : title;
  const prefix = title.slice(0, title.length - highlightedText.length);

  return (
    <h1
      className={`${className} font-display text-[36px] font-bold leading-[1.02] tracking-tight text-[#0b1c3a] sm:text-[44px]`}
    >
      {prefix}
      <span className="relative inline-block bg-gradient-to-r from-[#3b91f5] to-[#1668d6] bg-clip-text text-transparent">
        {highlightedText}
        <svg
          className="absolute -bottom-1 left-0 h-3 w-full text-[#ffb020]"
          viewBox="0 0 210 12"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M3 9C55 3 130 2 206 6"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </h1>
  );
}
